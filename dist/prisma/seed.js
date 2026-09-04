"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("cloudinary");
const bcrypt = __importStar(require("bcrypt"));
const permissions_constants_1 = require("../src/modules/rbac/permissions.constants");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding permissions...');
    const permissionRecords = await Promise.all(Object.values(permissions_constants_1.PERMISSIONS).map((key) => prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
    })));
    const permissionByKey = new Map(permissionRecords.map((p) => [p.key, p]));
    console.log('Seeding roles...');
    for (const roleName of Object.values(permissions_constants_1.ROLE_NAMES)) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, isSystem: true },
        });
        const permissionKeys = permissions_constants_1.ROLE_PERMISSIONS[roleName] ?? [];
        for (const key of permissionKeys) {
            const permission = permissionByKey.get(key);
            if (!permission)
                continue;
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
                update: {},
                create: { roleId: role.id, permissionId: permission.id },
            });
        }
    }
    console.log('Seeding admin user...');
    const adminEmail = 'admin@academy.test';
    const passwordHash = await bcrypt.hash('ChangeMe123!', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash,
            firstName: 'System',
            lastName: 'Administrator',
        },
    });
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: permissions_constants_1.ROLE_NAMES.ADMIN } });
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
        update: {},
        create: { userId: adminUser.id, roleId: adminRole.id },
    });
    console.log('Seeding sample academy structure...');
    const season = await prisma.season.upsert({
        where: { id: '00000000-0000-4000-8000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-4000-8000-000000000001',
            name: '2026 Season',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-12-31'),
        },
    });
    const ageCategory = await prisma.ageCategory.upsert({
        where: { code: 'U12' },
        update: {},
        create: { name: 'Under 12', code: 'U12', minAge: 10, maxAge: 12, sortOrder: 1 },
    });
    await prisma.team.upsert({
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
    await prisma.feeType.upsert({
        where: { id: '00000000-0000-4000-8000-000000000003' },
        update: {},
        create: {
            id: '00000000-0000-4000-8000-000000000003',
            name: 'Registration Fee',
            category: 'REGISTRATION',
            defaultAmount: 150,
            isRecurring: false,
        },
    });
    await prisma.feeType.upsert({
        where: { id: '00000000-0000-4000-8000-000000000004' },
        update: {},
        create: {
            id: '00000000-0000-4000-8000-000000000004',
            name: 'Merchandise',
            category: 'UNIFORM_EQUIPMENT',
            defaultAmount: 0,
            isRecurring: false,
        },
    });
    await prisma.configurationSetting.upsert({
        where: { key: 'player_id.academy_code' },
        update: {},
        create: { key: 'player_id.academy_code', value: 'ACA' },
    });
    console.log('Seeding gallery photos...');
    const galleryPhotoCount = await prisma.galleryPhoto.count();
    if (galleryPhotoCount > 0) {
        console.log('Gallery already has photos — skipping.');
    }
    else if (!process.env.CLOUDINARY_URL) {
        console.log('CLOUDINARY_URL not set — skipping gallery photo seed.');
    }
    else {
        cloudinary_1.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL, secure: true });
        const sampleImagePaths = [
            path.join(__dirname, '../../web/public/images/hero-academy.jpg'),
            path.join(__dirname, '../../web/public/images/hero-academy-2.jpg'),
        ];
        const contextDetails = {
            SATURDAY_TRAINING: { sessionDate: new Date(), details: 'Saturday training session' },
            MATCH: { sessionDate: new Date(), details: 'Match day' },
        };
        for (const context of Object.keys(contextDetails)) {
            for (const [index, imagePath] of sampleImagePaths.entries()) {
                const buffer = fs.readFileSync(imagePath);
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto', folder: 'soccer-academy' }, (error, result) => {
                        if (error || !result) {
                            reject(error instanceof Error ? error : new Error('Cloudinary upload failed'));
                            return;
                        }
                        resolve(result);
                    });
                    uploadStream.end(buffer);
                });
                await prisma.galleryPhoto.create({
                    data: {
                        context,
                        storageKey: `${uploadResult.resource_type}/${uploadResult.public_id}`,
                        sortOrder: index,
                        sessionDate: contextDetails[context].sessionDate,
                        details: contextDetails[context].details,
                        uploadedByUserId: adminUser.id,
                    },
                });
            }
        }
        console.log('Gallery photos seeded.');
    }
    console.log('Seed complete.');
    console.log(`Admin login: ${adminEmail} / ChangeMe123!`);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map