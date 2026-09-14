-- AlterTable
ALTER TABLE "age_categories" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "assessment_criteria" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "assessment_ratings" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "assessment_templates" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coach_assignments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coach_feedback" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coach_feedback_criteria" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coach_qualifications" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coach_remarks" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "coaches" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "configuration_settings" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "fee_items" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "fee_structures" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "fee_type_items" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "fee_types" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "financial_adjustments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "gallery_photos" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "guardians" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "issue_messages" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "match_participations" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "match_player_assessments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "merchandise_order_items" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "merchandise_orders" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "opponents" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "parent_issues" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "password_reset_tokens" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "payment_allocations" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "player_assessments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "player_group_assignments" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "player_guardians" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "player_of_the_week" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "player_registrations" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "players" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "product_images" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "public_inquiries" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "seasons" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_activities" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_activity_marks" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_approvals" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_attendance" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_groups" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_plans" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_session_activities" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "training_sessions" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "user_roles" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "academyId" SET DEFAULT current_setting('app.current_academy_id', true);

-- Phase 4: enable row-level security so tenant scoping is enforced by Postgres
-- itself, not just by application-level query filters. FORCE is required
-- because the app connects as the tables' owning role, and RLS does not
-- apply to a table's owner unless explicitly forced to.

ALTER TABLE "age_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "age_categories" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "age_categories"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "assessment_criteria" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assessment_criteria" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "assessment_criteria"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "assessment_ratings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assessment_ratings" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "assessment_ratings"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "assessment_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assessment_templates" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "assessment_templates"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "audit_logs"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coach_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coach_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coach_assignments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coach_feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coach_feedback" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coach_feedback"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coach_feedback_criteria" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coach_feedback_criteria" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coach_feedback_criteria"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coach_qualifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coach_qualifications" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coach_qualifications"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coach_remarks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coach_remarks" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coach_remarks"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "coaches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coaches" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "coaches"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "configuration_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "configuration_settings" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "configuration_settings"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "documents"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "fee_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fee_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "fee_items"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "fee_structures" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fee_structures" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "fee_structures"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "fee_type_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fee_type_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "fee_type_items"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "fee_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fee_types" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "fee_types"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "financial_adjustments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "financial_adjustments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "financial_adjustments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "gallery_photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gallery_photos" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "gallery_photos"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "guardians" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "guardians" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "guardians"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "invoices"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "issue_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "issue_messages" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "issue_messages"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "match_participations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_participations" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "match_participations"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "match_player_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_player_assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "match_player_assessments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "matches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "matches" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "matches"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "merchandise_order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "merchandise_order_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "merchandise_order_items"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "merchandise_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "merchandise_orders" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "merchandise_orders"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "notifications"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "opponents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "opponents" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "opponents"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "parent_issues" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "parent_issues" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "parent_issues"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "password_reset_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "password_reset_tokens" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "password_reset_tokens"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "payment_allocations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_allocations" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "payment_allocations"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "payments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "player_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "player_assessments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "player_group_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_group_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "player_group_assignments"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "player_guardians" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_guardians" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "player_guardians"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "player_of_the_week" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_of_the_week" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "player_of_the_week"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "player_registrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "player_registrations" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "player_registrations"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "players" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "players"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "product_images"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_variants" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "product_variants"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "products"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "public_inquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public_inquiries" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "public_inquiries"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "seasons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seasons" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "seasons"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "teams"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_activities" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_activities"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_activity_marks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_activity_marks" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_activity_marks"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_approvals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_approvals" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_approvals"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_attendance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_attendance" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_attendance"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_groups" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_groups" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_groups"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_plans" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_plans"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_session_activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_session_activities" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_session_activities"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "training_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "training_sessions" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "training_sessions"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_roles" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "user_roles"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "users"
  USING ("academyId" = current_setting('app.current_academy_id', true))
  WITH CHECK ("academyId" = current_setting('app.current_academy_id', true));

