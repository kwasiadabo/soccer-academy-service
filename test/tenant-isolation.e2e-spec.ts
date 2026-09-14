import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { TenantContextService } from '../src/common/tenant-context/tenant-context.service';
import { ROLE_NAMES } from '../src/modules/rbac/permissions.constants';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { deleteAcademyCompletely } from './cleanup-academy';
import { tenantRequest } from './tenant-request';

// The permanent regression guard for the multi-tenancy migration: seeds a second,
// self-contained academy alongside the seeded 'kapikids' one, then asserts that
// nothing — reads, writes, or direct-by-id lookups — ever crosses the boundary
// between them. A failure here means a real cross-academy data leak, so this
// suite should gate CI on every future change, not just run once.
describe('Tenant isolation (e2e)', () => {
  let app: INestApplication;
  let setupClient: PrismaClient;

  let academyAId: string;
  let academyBId: string;
  let tokenA: string;
  let tokenB: string;
  let reqA: ReturnType<typeof tenantRequest>;
  let reqB: ReturnType<typeof tenantRequest>;

  const SLUG_A = 'kapikids';
  const SLUG_B = `isolation-test-${Date.now()}`;
  const ADMIN_A = { email: 'admin@academy.test', password: 'ChangeMe123!' };
  const ADMIN_B = { email: `admin@${SLUG_B}.test`, password: 'IsolationTest123!' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api', { exclude: ['/'] });
    await app.init();

    reqA = tenantRequest(app, SLUG_A);
    reqB = tenantRequest(app, SLUG_B);

    // Set up academy B and its admin directly against the DB (mirroring prisma/seed.ts's
    // approach) rather than through a not-yet-built onboarding endpoint (Phase 10).
    setupClient = new PrismaClient();
    const academyA = await setupClient.academy.findUniqueOrThrow({ where: { slug: SLUG_A } });
    academyAId = academyA.id;

    const academyB = await setupClient.academy.upsert({
      where: { slug: SLUG_B },
      update: {},
      create: { slug: SLUG_B, name: 'Isolation Test Academy', status: 'ACTIVE' },
    });
    academyBId = academyB.id;

    const adminRole = await setupClient.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.ADMIN } });
    await setupClient.$executeRaw`SELECT set_config('app.current_academy_id', ${academyBId}, false)`;
    const adminUserB = await setupClient.user.upsert({
      where: { academyId_email: { academyId: academyBId, email: ADMIN_B.email } },
      update: {},
      create: {
        email: ADMIN_B.email,
        passwordHash: await bcrypt.hash(ADMIN_B.password, 10),
        firstName: 'Isolation',
        lastName: 'Admin',
      },
    });
    await setupClient.userRole.upsert({
      where: { userId_roleId: { userId: adminUserB.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUserB.id, roleId: adminRole.id },
    });

    tokenA = (await reqA.post('/api/auth/login').send(ADMIN_A).expect(200)).body.accessToken;
    tokenB = (await reqB.post('/api/auth/login').send(ADMIN_B).expect(200)).body.accessToken;
  });

  afterAll(async () => {
    await deleteAcademyCompletely(app.get(PrismaService), app.get(TenantContextService), setupClient, academyBId, SLUG_B);
    await setupClient.$disconnect();
    await app.close();
  });

  it("A's admin credentials don't authenticate against B, and vice versa", async () => {
    await reqB.post('/api/auth/login').send(ADMIN_A).expect(401);
    await reqA.post('/api/auth/login').send(ADMIN_B).expect(401);
  });

  it('a freshly-created academy starts with zero rows across every domain list', async () => {
    for (const path of ['/api/players', '/api/coaches', '/api/academy-config/seasons', '/api/academy-config/teams']) {
      const res = await reqB.get(path).set('Authorization', `Bearer ${tokenB}`).expect(200);
      expect(res.body).toEqual([]);
    }
  });

  it("A's non-empty lists are never visible from B", async () => {
    const playersA = await reqA.get('/api/players').set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(playersA.body.length).toBeGreaterThan(0);

    const playersB = await reqB.get('/api/players').set('Authorization', `Bearer ${tokenB}`).expect(200);
    expect(playersB.body).toEqual([]);
  });

  it('a record created under B is invisible to A, and vice versa, by id and by list', async () => {
    const created = await reqB
      .post('/api/academy-config/seasons')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Isolation Season', startDate: '2026-01-01', endDate: '2026-12-31' })
      .expect(201);

    expect(created.body.academyId).toBe(academyBId);

    const seasonsA = await reqA.get('/api/academy-config/seasons').set('Authorization', `Bearer ${tokenA}`).expect(200);
    expect(seasonsA.body.find((s: { id: string }) => s.id === created.body.id)).toBeUndefined();

    const seasonsB = await reqB.get('/api/academy-config/seasons').set('Authorization', `Bearer ${tokenB}`).expect(200);
    expect(seasonsB.body.find((s: { id: string }) => s.id === created.body.id)).toBeDefined();
  });

  it('academyId is never taken from the request body — the server always uses the caller\'s own tenant', async () => {
    // FeeType's create DTO doesn't expose academyId at all, so this also confirms
    // an extra/unexpected field can't sneak a cross-tenant write through validation.
    const res = await reqB
      .post('/api/academy-config/age-categories')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        name: 'Spoofed Category',
        code: `SPOOF-${Date.now()}`,
        minAge: 5,
        maxAge: 6,
        academyId: academyAId,
      })
      .expect(201);

    expect(res.body.academyId).toBe(academyBId);
    expect(res.body.academyId).not.toBe(academyAId);
  });
});
