import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { ROLE_NAMES } from '../src/modules/rbac/permissions.constants';
import { tenantRequest } from './tenant-request';

describe('Auth + RBAC (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let req: ReturnType<typeof tenantRequest>;
  let setupClient: PrismaClient;
  let academyId: string;
  let parentUserId: string;

  const seededAdmin = { email: 'admin@academy.test', password: 'ChangeMe123!' };
  const uniqueSuffix = Date.now();
  const parentUser = {
    email: `parent-${uniqueSuffix}@academy.test`,
    password: 'ParentPass123!',
    firstName: 'Test',
    lastName: 'Parent',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api', { exclude: ['/'] });
    await app.init();
    req = tenantRequest(app);

    const loginRes = await req
      .post('/api/auth/login')
      .send(seededAdmin)
      .expect(200);
    adminToken = loginRes.body.accessToken;

    // Created directly against the DB, not via POST /api/users: that endpoint
    // now only grants accounts to already-registered staff (Coach records),
    // and a Parent isn't staff — parents get accounts via a Guardian's own
    // "grant portal access" flow instead. This test only needs *a* Parent-role
    // user to exercise the permission guard below, not that flow itself.
    setupClient = new PrismaClient();
    const academy = await setupClient.academy.findUniqueOrThrow({ where: { slug: 'kapikids' } });
    academyId = academy.id;
    const parentRole = await setupClient.role.findUniqueOrThrow({ where: { name: ROLE_NAMES.PARENT } });
    await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academy.id}, true)`;
      const user = await tx.user.create({
        data: {
          email: parentUser.email,
          passwordHash: await bcrypt.hash(parentUser.password, 10),
          firstName: parentUser.firstName,
          lastName: parentUser.lastName,
        },
      });
      parentUserId = user.id;
      await tx.userRole.create({ data: { userId: user.id, roleId: parentRole.id } });
    });
  });

  afterAll(async () => {
    // Undoes this suite's own fixtures against the shared kapikids academy —
    // both this Parent user and the Season created by the test below (this
    // suite leaked both on every prior run before this cleanup existed).
    await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academyId}, true)`;
      await tx.userRole.deleteMany({ where: { userId: parentUserId } });
      await tx.user.delete({ where: { id: parentUserId } });
      await tx.season.deleteMany({ where: { name: `E2E Season ${uniqueSuffix}` } });
    });
    await setupClient.$disconnect();
    await app.close();
  });

  it('rejects login with invalid credentials', async () => {
    await req
      .post('/api/auth/login')
      .send({ email: seededAdmin.email, password: 'wrong-password' })
      .expect(401);
  });

  it('allows the admin (with ACADEMY_CONFIG_MANAGE) to create a season', async () => {
    await req
      .post('/api/academy-config/seasons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `E2E Season ${uniqueSuffix}`, startDate: '2026-01-01', endDate: '2026-12-31' })
      .expect(201);
  });

  it('rejects a parent-role user (lacking ACADEMY_CONFIG_MANAGE) with 403', async () => {
    const parentLogin = await req
      .post('/api/auth/login')
      .send({ email: parentUser.email, password: parentUser.password })
      .expect(200);
    const parentToken = parentLogin.body.accessToken;

    await req
      .post('/api/academy-config/seasons')
      .set('Authorization', `Bearer ${parentToken}`)
      .send({ name: 'Should Fail', startDate: '2026-01-01', endDate: '2026-12-31' })
      .expect(403);
  });
});
