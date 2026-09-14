import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { TenantContextService } from '../src/common/tenant-context/tenant-context.service';
import { FinanceService } from '../src/modules/finance/finance.service';
import { TrainingService } from '../src/modules/training/training.service';
import { PlayerOfTheWeekService } from '../src/modules/player-of-the-week/player-of-the-week.service';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { deleteAcademyCompletely } from './cleanup-academy';

// The three @Cron jobs (monthly billing, Saturday session provisioning, player-of-the-week)
// used to scan the whole database with no tenant boundary. Phase 8 makes each one loop
// per-academy instead — this confirms that loop actually isolates academies rather than,
// say, accidentally billing every academy's players against one academy's fee types.
describe('Cron jobs: tenant scoping (e2e)', () => {
  let app: INestApplication;
  let setupClient: PrismaClient;
  let financeService: FinanceService;
  let trainingService: TrainingService;
  let playerOfTheWeekService: PlayerOfTheWeekService;

  const SLUG = `cron-test-${Date.now()}`;
  let academyId: string;
  let otherAcademyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    financeService = moduleFixture.get(FinanceService);
    trainingService = moduleFixture.get(TrainingService);
    playerOfTheWeekService = moduleFixture.get(PlayerOfTheWeekService);

    setupClient = new PrismaClient();
    const academy = await setupClient.academy.create({
      data: { slug: SLUG, name: 'Cron Test Academy', status: 'ACTIVE' },
    });
    academyId = academy.id;

    const kapikids = await setupClient.academy.findUniqueOrThrow({ where: { slug: 'kapikids' } });
    otherAcademyId = kapikids.id;

    // One interactive transaction, not separate calls — set_config with is_local=false
    // only affects whichever pooled connection issues it, and separate awaited calls
    // aren't guaranteed to reuse that same connection.
    await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academyId}, true)`;
      const ageCategory = await tx.ageCategory.create({
        data: { name: 'Cron Test U10', code: `CRON-U10-${Date.now()}`, minAge: 8, maxAge: 10 },
      });
      await tx.feeType.create({
        data: { name: 'Cron Monthly Fee', defaultAmount: 42, isRecurring: true, isActive: true },
      });
      await tx.player.create({
        data: {
          firstName: 'Cron',
          lastName: 'TestPlayer',
          dateOfBirth: new Date('2015-01-01'),
          gender: 'MALE',
          status: 'ACTIVE',
          ageCategoryId: ageCategory.id,
        },
      });
    });
  });

  afterAll(async () => {
    await deleteAcademyCompletely(app.get(PrismaService), app.get(TenantContextService), setupClient, academyId, SLUG);
    await setupClient.$disconnect();
    await app.close();
  });

  it('bills only the academy with a recurring fee type and an active player, not any other academy', async () => {
    const before = await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${otherAcademyId}, true)`;
      return tx.invoice.count({ where: { feeType: { name: 'Cron Monthly Fee' } } });
    });
    expect(before).toBe(0);

    await financeService.handleMonthlyBillingCron();

    const invoicesForTestAcademy = await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${academyId}, true)`;
      return tx.invoice.findMany({ where: { feeType: { name: 'Cron Monthly Fee' } } });
    });
    expect(invoicesForTestAcademy).toHaveLength(1);
    expect(invoicesForTestAcademy[0].academyId).toBe(academyId);

    const invoicesForOtherAcademy = await setupClient.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_academy_id', ${otherAcademyId}, true)`;
      return tx.invoice.count({ where: { feeType: { name: 'Cron Monthly Fee' } } });
    });
    expect(invoicesForOtherAcademy).toBe(0);
  });

  it('provisions Saturday sessions and computes player-of-the-week per academy without throwing across all active academies', async () => {
    // These two touch every active academy (including ones with no teams/sessions at all,
    // like the freshly-created one above) — the real regression they guard against is a
    // forgotten tenantContext.run() anywhere in the loop surfacing as a thrown "outside of a
    // tenant context" error, which TenantContextService raises by design (see Phase 1). If
    // either call rejects, this test fails without any extra assertion needed.
    await trainingService.handleSaturdaySessionsCron();
    await playerOfTheWeekService.handleWeeklyComputationCron();
  });
});
