import * as fs from 'fs';
import * as path from 'path';
import { GalleryPhotoContext, PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as bcrypt from 'bcrypt';
import { PERMISSIONS, ROLE_NAMES, ROLE_PERMISSIONS } from '../src/modules/rbac/permissions.constants';

const prisma = new PrismaClient();

// This script runs standalone, outside any HTTP request — there's no
// tenant-resolution middleware to set the current academy for it. It seeds
// (or reuses) one designated academy explicitly, then sets the same Postgres
// session variable the app's request-scoped middleware would set, so every
// tenant-scoped table's `academyId` default (and every row-level-security
// policy) resolves against that academy for the rest of this run.
const SEED_ACADEMY_SLUG = 'kapikids';
const SEED_ACADEMY_NAME = 'Kapikids Soccer Academy';

async function main() {
  console.log(`Seeding academy '${SEED_ACADEMY_SLUG}'...`);
  const academy = await prisma.academy.upsert({
    where: { slug: SEED_ACADEMY_SLUG },
    update: {},
    create: { slug: SEED_ACADEMY_SLUG, name: SEED_ACADEMY_NAME, status: 'ACTIVE' },
  });

  console.log('Seeding a default platform admin (platform-operator control plane)...');
  const platformAdminEmail = 'platform-admin@sams.internal';
  await prisma.platformAdmin.upsert({
    where: { email: platformAdminEmail },
    update: {},
    create: {
      email: platformAdminEmail,
      passwordHash: await bcrypt.hash('ChangeMe123!', 10),
      firstName: 'Platform',
      lastName: 'Operator',
    },
  });

  console.log('Seeding permissions...');
  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      }),
    ),
  );
  const permissionByKey = new Map(permissionRecords.map((p) => [p.key, p]));

  console.log('Seeding roles...');
  for (const roleName of Object.values(ROLE_NAMES)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, isSystem: true },
    });

    const permissionKeys = ROLE_PERMISSIONS[roleName] ?? [];
    for (const key of permissionKeys) {
      const permission = permissionByKey.get(key);
      if (!permission) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const adminEmail = 'admin@academy.test';
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  // Everything below is tenant-scoped (see TENANT_SCOPED_MODELS) and needs
  // `app.current_academy_id` set for its academyId default/RLS check to
  // resolve correctly. A single interactive transaction, not a bare
  // `set_config(..., false)` before separate calls — Prisma's connection pool
  // doesn't guarantee later calls reuse the same connection a session-level
  // set_config was run on, which silently breaks exactly this kind of script.
  const adminUser = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academy.id}, true)`;

    console.log('Seeding academy settings...');
    await tx.academySettings.upsert({
      where: { academyId: academy.id },
      update: {},
      create: { academyId: academy.id, brandName: SEED_ACADEMY_NAME },
    });

    const hasScheduleSlot = await tx.trainingScheduleSlot.findFirst({ where: { academyId: academy.id } });
    if (!hasScheduleSlot) {
      await tx.trainingScheduleSlot.create({
        data: { academyId: academy.id, dayOfWeek: 6, startTime: '08:00', endTime: '10:00' },
      });
    }

    console.log('Seeding admin user...');
    const user = await tx.user.upsert({
      where: { academyId_email: { academyId: academy.id, email: adminEmail } },
      update: {},
      create: {
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
      },
    });

    const adminRole = await tx.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.ADMIN } });
    await tx.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
      update: {},
      create: { userId: user.id, roleId: adminRole.id },
    });

    console.log('Seeding sample academy structure...');
    const season = await tx.season.upsert({
      where: { id: '00000000-0000-4000-8000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-4000-8000-000000000001',
        name: '2026 Season',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
    });

    const ageCategory = await tx.ageCategory.upsert({
      where: { academyId_code: { academyId: academy.id, code: 'U12' } },
      update: {},
      create: { name: 'Under 12', code: 'U12', minAge: 10, maxAge: 12, sortOrder: 1 },
    });

    await tx.team.upsert({
      where: { id: '00000000-0000-4000-8000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-4000-8000-000000000002',
        name: 'U12 Eagles',
        ageCategoryId: ageCategory.id,
        seasonId: season.id,
      },
    });

    console.log('Seeding fee types and configuration...');
    await tx.feeType.upsert({
      where: { id: '00000000-0000-4000-8000-000000000003' },
      update: {},
      create: {
        id: '00000000-0000-4000-8000-000000000003',
        name: 'Registration Fee',
        isRegistrationFee: true,
        defaultAmount: 150,
        isRecurring: false,
      },
    });

    await tx.feeType.upsert({
      where: { id: '00000000-0000-4000-8000-000000000004' },
      update: {},
      create: {
        id: '00000000-0000-4000-8000-000000000004',
        name: 'Merchandise',
        defaultAmount: 0,
        isRecurring: false,
      },
    });

    await tx.configurationSetting.upsert({
      where: { academyId_key: { academyId: academy.id, key: 'player_id.academy_code' } },
      update: {},
      create: { key: 'player_id.academy_code', value: 'ACA' },
    });

    return user;
  }, { timeout: 20000 });

  console.log('Seeding gallery photos...');
  const galleryPhotoCount = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academy.id}, true)`;
    return tx.galleryPhoto.count();
  }, { timeout: 20000 });
  if (galleryPhotoCount > 0) {
    console.log('Gallery already has photos — skipping.');
  } else if (!process.env.CLOUDINARY_URL) {
    console.log('CLOUDINARY_URL not set — skipping gallery photo seed.');
  } else {
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL, secure: true });

    // Reused as placeholder imagery for both contexts until real Saturday/match photos
    // are uploaded via the Gallery admin page — these are the same stock shots already
    // used on the marketing site's hero section.
    const sampleImagePaths = [
      path.join(__dirname, '../../web/public/images/hero-academy.jpg'),
      path.join(__dirname, '../../web/public/images/hero-academy-2.jpg'),
    ];
    const contextDetails: Record<GalleryPhotoContext, { sessionDate: Date; details: string }> = {
      SATURDAY_TRAINING: { sessionDate: new Date(), details: 'Saturday training session' },
      MATCH: { sessionDate: new Date(), details: 'Match day' },
    };

    for (const context of Object.keys(contextDetails) as GalleryPhotoContext[]) {
      for (const [index, imagePath] of sampleImagePaths.entries()) {
        const buffer = fs.readFileSync(imagePath);
        const uploadResult = await new Promise<{ public_id: string; resource_type: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'soccer-academy' },
            (error, result) => {
              if (error || !result) {
                reject(error instanceof Error ? error : new Error('Cloudinary upload failed'));
                return;
              }
              resolve(result);
            },
          );
          uploadStream.end(buffer);
        });

        // Paired with its own SET LOCAL rather than reusing one session-level
        // set_config from earlier — same connection-pooling reason as above —
        // and kept to just the DB write so the transaction never spans the
        // slow Cloudinary upload above it.
        await prisma.$transaction([
          prisma.$executeRaw`SELECT set_config('app.current_academy_id', ${academy.id}, true)`,
          prisma.galleryPhoto.create({
            data: {
              context,
              storageKey: `${uploadResult.resource_type}/${uploadResult.public_id}`,
              sortOrder: index,
              sessionDate: contextDetails[context].sessionDate,
              details: contextDetails[context].details,
              uploadedByUserId: adminUser.id,
            },
          }),
        ]);
      }
    }
    console.log('Gallery photos seeded.');
  }

  console.log('Seed complete.');
  console.log(`Admin login: ${adminEmail} / ChangeMe123!`);
  console.log(`Platform admin login: ${platformAdminEmail} / ChangeMe123!`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
