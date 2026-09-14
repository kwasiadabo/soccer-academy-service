-- Phase 3: backfill existing single-tenant data into Academy #1 (kapikids),
-- then tighten academyId to NOT NULL and convert the four affected unique
-- constraints to be composite per-academy.

-- Step 1: backfill every existing row onto Academy #1.
UPDATE "age_categories" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "assessment_criteria" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "assessment_ratings" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "assessment_templates" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "audit_logs" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coach_assignments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coach_feedback" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coach_feedback_criteria" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coach_qualifications" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coach_remarks" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "coaches" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "configuration_settings" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "documents" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "fee_items" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "fee_structures" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "fee_type_items" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "fee_types" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "financial_adjustments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "gallery_photos" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "guardians" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "invoices" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "issue_messages" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "match_participations" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "match_player_assessments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "matches" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "merchandise_order_items" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "merchandise_orders" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "notifications" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "opponents" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "parent_issues" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "password_reset_tokens" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "payment_allocations" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "payments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "player_assessments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "player_group_assignments" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "player_guardians" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "player_of_the_week" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "player_registrations" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "players" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "product_images" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "product_variants" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "products" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "public_inquiries" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "seasons" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "teams" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_activities" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_activity_marks" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_approvals" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_attendance" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_groups" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_plans" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_session_activities" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "training_sessions" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "user_roles" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;
UPDATE "users" SET "academyId" = '4215c3be-1a68-4818-b21b-124c9c687269' WHERE "academyId" IS NULL;

-- Step 2: guard-rail — abort if any row anywhere was missed.
DO $$
DECLARE
  remaining INT;
BEGIN
  SELECT (
    (SELECT count(*) FROM "age_categories" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "assessment_criteria" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "assessment_ratings" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "assessment_templates" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "audit_logs" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coach_assignments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coach_feedback" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coach_feedback_criteria" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coach_qualifications" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coach_remarks" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "coaches" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "configuration_settings" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "documents" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "fee_items" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "fee_structures" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "fee_type_items" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "fee_types" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "financial_adjustments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "gallery_photos" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "guardians" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "invoices" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "issue_messages" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "match_participations" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "match_player_assessments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "matches" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "merchandise_order_items" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "merchandise_orders" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "notifications" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "opponents" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "parent_issues" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "password_reset_tokens" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "payment_allocations" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "payments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "player_assessments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "player_group_assignments" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "player_guardians" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "player_of_the_week" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "player_registrations" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "players" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "product_images" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "product_variants" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "products" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "public_inquiries" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "seasons" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "teams" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_activities" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_activity_marks" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_approvals" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_attendance" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_groups" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_plans" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_session_activities" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "training_sessions" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "user_roles" WHERE "academyId" IS NULL) +
    (SELECT count(*) FROM "users" WHERE "academyId" IS NULL) +
    0
  ) INTO remaining;
  IF remaining > 0 THEN
    RAISE EXCEPTION 'Phase 3 backfill incomplete: % row(s) still have a NULL academyId', remaining;
  END IF;
END $$;

-- Step 3: tighten academyId to NOT NULL now that every row has one.
ALTER TABLE "age_categories" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "assessment_criteria" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "assessment_ratings" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "assessment_templates" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "audit_logs" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coach_assignments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coach_feedback" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coach_feedback_criteria" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coach_qualifications" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coach_remarks" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "coaches" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "configuration_settings" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "documents" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "fee_items" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "fee_structures" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "fee_type_items" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "fee_types" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "financial_adjustments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "gallery_photos" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "guardians" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "issue_messages" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "match_participations" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "match_player_assessments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "matches" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "merchandise_order_items" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "merchandise_orders" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "notifications" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "opponents" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "parent_issues" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "password_reset_tokens" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "payment_allocations" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "payments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "player_assessments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "player_group_assignments" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "player_guardians" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "player_of_the_week" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "player_registrations" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "players" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "product_images" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "product_variants" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "public_inquiries" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "seasons" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "teams" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_activities" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_activity_marks" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_approvals" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_attendance" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_groups" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_plans" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_session_activities" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "training_sessions" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "user_roles" ALTER COLUMN "academyId" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "academyId" SET NOT NULL;

-- Step 4: convert the four global unique constraints to per-academy composites.
DROP INDEX "users_email_key";
CREATE UNIQUE INDEX "users_academyId_email_key" ON "users"("academyId", "email");

DROP INDEX "age_categories_code_key";
CREATE UNIQUE INDEX "age_categories_academyId_code_key" ON "age_categories"("academyId", "code");

DROP INDEX "players_playerCode_key";
CREATE UNIQUE INDEX "players_academyId_playerCode_key" ON "players"("academyId", "playerCode");

DROP INDEX "configuration_settings_key_key";
CREATE UNIQUE INDEX "configuration_settings_academyId_key_key" ON "configuration_settings"("academyId", "key");
