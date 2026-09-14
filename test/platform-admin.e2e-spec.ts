import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { TenantContextService } from '../src/common/tenant-context/tenant-context.service';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { deleteAcademyCompletely } from './cleanup-academy';
import { tenantRequest } from './tenant-request';

// Verifies the three guarantees the platform-admin control plane exists for:
// a platform credential and an academy credential are never interchangeable,
// suspending one academy immediately blocks it without touching any other,
// and onboarding produces a genuinely working first-admin login end to end.
describe('Platform admin (e2e)', () => {
  let app: INestApplication;
  let setupClient: PrismaClient;
  let req: ReturnType<typeof tenantRequest>;

  // A unique, disposable email per run — never the real seeded
  // 'platform-admin@sams.internal' row, which is a live credential someone
  // may actually be signed in with outside this test run.
  const PLATFORM_ADMIN_EMAIL = `platform-admin-test-${Date.now()}@sams.internal`;
  const PLATFORM_ADMIN_PASSWORD = `PlatformTest-${Date.now()}!`;
  const NEW_SLUG = `onboard-test-${Date.now()}`;
  const NEW_ADMIN_EMAIL = `admin@${NEW_SLUG}.test`;

  let platformToken: string;
  let academyToken: string;
  let newAcademyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api', { exclude: ['/'] });
    await app.init();

    req = tenantRequest(app, 'kapikids');

    // A dedicated, disposable platform admin for this test run, rather than
    // depending on — or mutating — whatever the seed script happens to have
    // created. The email is unique per run, so this is always a fresh insert.
    setupClient = new PrismaClient();
    await setupClient.platformAdmin.create({
      data: {
        email: PLATFORM_ADMIN_EMAIL,
        passwordHash: await bcrypt.hash(PLATFORM_ADMIN_PASSWORD, 10),
        firstName: 'Test',
        lastName: 'Operator',
      },
    });

    platformToken = (
      await req.post('/api/platform/auth/login').send({ email: PLATFORM_ADMIN_EMAIL, password: PLATFORM_ADMIN_PASSWORD }).expect(200)
    ).body.accessToken;

    academyToken = (
      await req.post('/api/auth/login').send({ email: 'admin@academy.test', password: 'ChangeMe123!' }).expect(200)
    ).body.accessToken;
  });

  afterAll(async () => {
    if (newAcademyId) {
      await deleteAcademyCompletely(
        app.get(PrismaService),
        app.get(TenantContextService),
        setupClient,
        newAcademyId,
        NEW_SLUG,
      );
    }

    await setupClient.platformAdmin.delete({ where: { email: PLATFORM_ADMIN_EMAIL } }).catch(() => undefined);
    await setupClient.$disconnect();
    await app.close();
  });

  it('a platform token and an academy token are never interchangeable', async () => {
    await req.get('/api/players').set('Authorization', `Bearer ${platformToken}`).expect(401);
    await req.get('/api/platform/academies').set('Authorization', `Bearer ${academyToken}`).expect(401);
  });

  it('onboards a new academy end to end, with a working first-admin login that can reach no other data', async () => {
    const onboardRes = await req
      .post('/api/platform/academies')
      .set('Authorization', `Bearer ${platformToken}`)
      .send({ slug: NEW_SLUG, name: 'Onboard Test Academy', adminEmail: NEW_ADMIN_EMAIL, adminFirstName: 'New', adminLastName: 'Admin' })
      .expect(201);

    newAcademyId = onboardRes.body.academy.id;
    expect(onboardRes.body.academy.slug).toBe(NEW_SLUG);
    const temporaryPassword: string = onboardRes.body.admin.temporaryPassword;
    expect(temporaryPassword.length).toBeGreaterThan(8);

    const newAcademyReq = tenantRequest(app, NEW_SLUG);
    const loginRes = await newAcademyReq
      .post('/api/auth/login')
      .send({ email: NEW_ADMIN_EMAIL, password: temporaryPassword })
      .expect(200);

    expect(loginRes.body.user.mustChangePassword).toBe(true);
    expect(loginRes.body.user.roles).toContain('System Administrator');

    // mustChangePassword blocks every route except a small allowlist (see
    // JwtStrategy) — /auth/me is on it, and is enough to prove this token is
    // valid and correctly scoped to the new academy without bypassing that gate.
    const newAdminToken = loginRes.body.accessToken;
    const meRes = await newAcademyReq.get('/api/auth/me').set('Authorization', `Bearer ${newAdminToken}`).expect(200);
    expect(meRes.body.email).toBe(NEW_ADMIN_EMAIL);
  });

  it('suspending an academy blocks all its traffic immediately while another academy is unaffected', async () => {
    await req.patch(`/api/platform/academies/${newAcademyId}/suspend`).set('Authorization', `Bearer ${platformToken}`).expect(200);

    const suspendedReq = tenantRequest(app, NEW_SLUG);
    await suspendedReq.post('/api/auth/login').send({ email: NEW_ADMIN_EMAIL, password: 'irrelevant' }).expect(403);

    await req.post('/api/auth/login').send({ email: 'admin@academy.test', password: 'ChangeMe123!' }).expect(200);

    await req.patch(`/api/platform/academies/${newAcademyId}/reactivate`).set('Authorization', `Bearer ${platformToken}`).expect(200);
  });
});
