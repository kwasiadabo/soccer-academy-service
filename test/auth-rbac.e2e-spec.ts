import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ROLE_NAMES } from '../src/modules/rbac/permissions.constants';

describe('Auth + RBAC (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  const seededAdmin = { email: 'admin@academy.test', password: 'ChangeMe123!' };
  const uniqueSuffix = Date.now();
  const parentUser = {
    email: `parent-${uniqueSuffix}@academy.test`,
    password: 'ParentPass123!',
    firstName: 'Test',
    lastName: 'Parent',
    roleNames: [ROLE_NAMES.PARENT],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api', { exclude: ['/'] });
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(seededAdmin)
      .expect(200);
    adminToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects login with invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: seededAdmin.email, password: 'wrong-password' })
      .expect(401);
  });

  it('allows the admin (with ACADEMY_CONFIG_MANAGE) to create a season', async () => {
    await request(app.getHttpServer())
      .post('/api/academy-config/seasons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: `E2E Season ${uniqueSuffix}`, startDate: '2026-01-01', endDate: '2026-12-31' })
      .expect(201);
  });

  it('rejects a parent-role user (lacking ACADEMY_CONFIG_MANAGE) with 403', async () => {
    await request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(parentUser)
      .expect(201);

    const parentLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: parentUser.email, password: parentUser.password })
      .expect(200);
    const parentToken = parentLogin.body.accessToken;

    await request(app.getHttpServer())
      .post('/api/academy-config/seasons')
      .set('Authorization', `Bearer ${parentToken}`)
      .send({ name: 'Should Fail', startDate: '2026-01-01', endDate: '2026-12-31' })
      .expect(403);
  });
});
