import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Player Registration (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let ageCategoryId: string;

  const seededAdmin = { email: 'admin@academy.test', password: 'ChangeMe123!' };

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

    const ageCategories = await request(app.getHttpServer())
      .get('/api/academy-config/age-categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    ageCategoryId = ageCategories.body[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('takes a registration from draft through to an active player with a generated Player ID', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'E2E',
        lastName: `Player-${Date.now()}`,
        dateOfBirth: '2015-06-01',
        gender: 'MALE',
        ageCategoryId,
        guardians: [
          { firstName: 'E2E', lastName: 'Guardian', phone: '0240000001', relationship: 'MOTHER', isPrimary: true },
        ],
      })
      .expect(201);

    expect(createRes.body.status).toBe('DRAFT');
    expect(createRes.body.guardians).toHaveLength(1);
    const playerId = createRes.body.id;

    const submitRes = await request(app.getHttpServer())
      .post(`/api/players/${playerId}/submit`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);
    expect(submitRes.body.status).toBe('SUBMITTED');

    const approveRes = await request(app.getHttpServer())
      .post(`/api/players/${playerId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);
    expect(approveRes.body.status).toBe('PENDING_REGISTRATION_PAYMENT');
    expect(approveRes.body.registrations[0].registrationFeeInvoiceId).toBeTruthy();
    expect(approveRes.body.playerCode).toBeNull();

    const paymentRes = await request(app.getHttpServer())
      .post(`/api/players/${playerId}/confirm-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ method: 'CASH' })
      .expect(201);

    expect(paymentRes.body.player.status).toBe('ACTIVE');
    expect(paymentRes.body.player.playerCode).toMatch(/^ACA-[A-Z0-9]+-\d{4}-\d{5}$/);
    expect(paymentRes.body.payment.amount).toBe('150');
  });

  it('rejects approval before submission and rejects payment confirmation before approval', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'E2E',
        lastName: `NotReady-${Date.now()}`,
        dateOfBirth: '2016-01-01',
        gender: 'FEMALE',
        ageCategoryId,
        guardians: [
          { firstName: 'E2E', lastName: 'Guardian2', phone: '0240000002', relationship: 'FATHER', isPrimary: true },
        ],
      })
      .expect(201);
    const playerId = createRes.body.id;

    await request(app.getHttpServer())
      .post(`/api/players/${playerId}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    await request(app.getHttpServer())
      .post(`/api/players/${playerId}/confirm-payment`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ method: 'CASH' })
      .expect(400);
  });

  it('uploads and serves a player photo', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/players')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'E2E',
        lastName: `Photo-${Date.now()}`,
        dateOfBirth: '2014-03-15',
        gender: 'MALE',
        ageCategoryId,
        guardians: [
          { firstName: 'E2E', lastName: 'Guardian3', phone: '0240000003', relationship: 'GUARDIAN', isPrimary: true },
        ],
      })
      .expect(201);
    const playerId = createRes.body.id;

    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    );

    const uploadRes = await request(app.getHttpServer())
      .post(`/api/players/${playerId}/photo`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', pngBuffer, { filename: 'photo.png', contentType: 'image/png' })
      .expect(201);

    expect(uploadRes.body.photoDocumentId).toBeTruthy();

    const photoRes = await request(app.getHttpServer())
      .get(`/api/players/${playerId}/photo`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(photoRes.headers['content-type']).toBe('image/png');
    expect(Buffer.compare(photoRes.body, pngBuffer)).toBe(0);
  });
});
