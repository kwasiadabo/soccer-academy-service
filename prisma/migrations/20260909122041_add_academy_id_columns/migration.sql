-- AlterTable
ALTER TABLE "age_categories" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "assessment_criteria" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "assessment_ratings" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "assessment_templates" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coach_assignments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coach_feedback" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coach_feedback_criteria" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coach_qualifications" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coach_remarks" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "coaches" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "configuration_settings" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "fee_items" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "fee_structures" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "fee_type_items" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "fee_types" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "financial_adjustments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "gallery_photos" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "guardians" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "issue_messages" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "match_participations" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "match_player_assessments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "merchandise_order_items" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "merchandise_orders" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "opponents" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "parent_issues" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "password_reset_tokens" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "payment_allocations" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "player_assessments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "player_group_assignments" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "player_guardians" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "player_of_the_week" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "player_registrations" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "public_inquiries" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "seasons" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_activities" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_activity_marks" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_approvals" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_attendance" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_groups" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_plans" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_session_activities" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "training_sessions" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "academyId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "academyId" TEXT;

-- CreateIndex
CREATE INDEX "age_categories_academyId_idx" ON "age_categories"("academyId");

-- CreateIndex
CREATE INDEX "assessment_criteria_academyId_idx" ON "assessment_criteria"("academyId");

-- CreateIndex
CREATE INDEX "assessment_ratings_academyId_idx" ON "assessment_ratings"("academyId");

-- CreateIndex
CREATE INDEX "assessment_templates_academyId_idx" ON "assessment_templates"("academyId");

-- CreateIndex
CREATE INDEX "audit_logs_academyId_idx" ON "audit_logs"("academyId");

-- CreateIndex
CREATE INDEX "coach_assignments_academyId_idx" ON "coach_assignments"("academyId");

-- CreateIndex
CREATE INDEX "coach_feedback_academyId_idx" ON "coach_feedback"("academyId");

-- CreateIndex
CREATE INDEX "coach_feedback_criteria_academyId_idx" ON "coach_feedback_criteria"("academyId");

-- CreateIndex
CREATE INDEX "coach_qualifications_academyId_idx" ON "coach_qualifications"("academyId");

-- CreateIndex
CREATE INDEX "coach_remarks_academyId_idx" ON "coach_remarks"("academyId");

-- CreateIndex
CREATE INDEX "coaches_academyId_idx" ON "coaches"("academyId");

-- CreateIndex
CREATE INDEX "configuration_settings_academyId_idx" ON "configuration_settings"("academyId");

-- CreateIndex
CREATE INDEX "documents_academyId_idx" ON "documents"("academyId");

-- CreateIndex
CREATE INDEX "fee_items_academyId_idx" ON "fee_items"("academyId");

-- CreateIndex
CREATE INDEX "fee_structures_academyId_idx" ON "fee_structures"("academyId");

-- CreateIndex
CREATE INDEX "fee_type_items_academyId_idx" ON "fee_type_items"("academyId");

-- CreateIndex
CREATE INDEX "fee_types_academyId_idx" ON "fee_types"("academyId");

-- CreateIndex
CREATE INDEX "financial_adjustments_academyId_idx" ON "financial_adjustments"("academyId");

-- CreateIndex
CREATE INDEX "gallery_photos_academyId_idx" ON "gallery_photos"("academyId");

-- CreateIndex
CREATE INDEX "guardians_academyId_idx" ON "guardians"("academyId");

-- CreateIndex
CREATE INDEX "invoices_academyId_idx" ON "invoices"("academyId");

-- CreateIndex
CREATE INDEX "issue_messages_academyId_idx" ON "issue_messages"("academyId");

-- CreateIndex
CREATE INDEX "match_participations_academyId_idx" ON "match_participations"("academyId");

-- CreateIndex
CREATE INDEX "match_player_assessments_academyId_idx" ON "match_player_assessments"("academyId");

-- CreateIndex
CREATE INDEX "matches_academyId_idx" ON "matches"("academyId");

-- CreateIndex
CREATE INDEX "merchandise_order_items_academyId_idx" ON "merchandise_order_items"("academyId");

-- CreateIndex
CREATE INDEX "merchandise_orders_academyId_idx" ON "merchandise_orders"("academyId");

-- CreateIndex
CREATE INDEX "notifications_academyId_idx" ON "notifications"("academyId");

-- CreateIndex
CREATE INDEX "opponents_academyId_idx" ON "opponents"("academyId");

-- CreateIndex
CREATE INDEX "parent_issues_academyId_idx" ON "parent_issues"("academyId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_academyId_idx" ON "password_reset_tokens"("academyId");

-- CreateIndex
CREATE INDEX "payment_allocations_academyId_idx" ON "payment_allocations"("academyId");

-- CreateIndex
CREATE INDEX "payments_academyId_idx" ON "payments"("academyId");

-- CreateIndex
CREATE INDEX "player_assessments_academyId_idx" ON "player_assessments"("academyId");

-- CreateIndex
CREATE INDEX "player_group_assignments_academyId_idx" ON "player_group_assignments"("academyId");

-- CreateIndex
CREATE INDEX "player_guardians_academyId_idx" ON "player_guardians"("academyId");

-- CreateIndex
CREATE INDEX "player_of_the_week_academyId_idx" ON "player_of_the_week"("academyId");

-- CreateIndex
CREATE INDEX "player_registrations_academyId_idx" ON "player_registrations"("academyId");

-- CreateIndex
CREATE INDEX "players_academyId_idx" ON "players"("academyId");

-- CreateIndex
CREATE INDEX "product_images_academyId_idx" ON "product_images"("academyId");

-- CreateIndex
CREATE INDEX "product_variants_academyId_idx" ON "product_variants"("academyId");

-- CreateIndex
CREATE INDEX "products_academyId_idx" ON "products"("academyId");

-- CreateIndex
CREATE INDEX "public_inquiries_academyId_idx" ON "public_inquiries"("academyId");

-- CreateIndex
CREATE INDEX "seasons_academyId_idx" ON "seasons"("academyId");

-- CreateIndex
CREATE INDEX "teams_academyId_idx" ON "teams"("academyId");

-- CreateIndex
CREATE INDEX "training_activities_academyId_idx" ON "training_activities"("academyId");

-- CreateIndex
CREATE INDEX "training_activity_marks_academyId_idx" ON "training_activity_marks"("academyId");

-- CreateIndex
CREATE INDEX "training_approvals_academyId_idx" ON "training_approvals"("academyId");

-- CreateIndex
CREATE INDEX "training_attendance_academyId_idx" ON "training_attendance"("academyId");

-- CreateIndex
CREATE INDEX "training_groups_branchId_idx" ON "training_groups"("branchId");

-- CreateIndex
CREATE INDEX "training_groups_academyId_idx" ON "training_groups"("academyId");

-- CreateIndex
CREATE INDEX "training_plans_academyId_idx" ON "training_plans"("academyId");

-- CreateIndex
CREATE INDEX "training_session_activities_academyId_idx" ON "training_session_activities"("academyId");

-- CreateIndex
CREATE INDEX "training_sessions_academyId_idx" ON "training_sessions"("academyId");

-- CreateIndex
CREATE INDEX "user_roles_academyId_idx" ON "user_roles"("academyId");

-- CreateIndex
CREATE INDEX "users_academyId_idx" ON "users"("academyId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "age_categories" ADD CONSTRAINT "age_categories_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_groups" ADD CONSTRAINT "training_groups_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_guardians" ADD CONSTRAINT "player_guardians_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_registrations" ADD CONSTRAINT "player_registrations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_group_assignments" ADD CONSTRAINT "player_group_assignments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_types" ADD CONSTRAINT "fee_types_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fee_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_type_items" ADD CONSTRAINT "fee_type_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_adjustments" ADD CONSTRAINT "financial_adjustments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_qualifications" ADD CONSTRAINT "coach_qualifications_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activities" ADD CONSTRAINT "training_activities_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activity_marks" ADD CONSTRAINT "training_activity_marks_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_approvals" ADD CONSTRAINT "training_approvals_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_of_the_week" ADD CONSTRAINT "player_of_the_week_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_activities" ADD CONSTRAINT "training_session_activities_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_attendance" ADD CONSTRAINT "training_attendance_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_criteria" ADD CONSTRAINT "assessment_criteria_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_assessments" ADD CONSTRAINT "player_assessments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_ratings" ADD CONSTRAINT "assessment_ratings_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_remarks" ADD CONSTRAINT "coach_remarks_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opponents" ADD CONSTRAINT "opponents_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participations" ADD CONSTRAINT "match_participations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_assessments" ADD CONSTRAINT "match_player_assessments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_feedback" ADD CONSTRAINT "coach_feedback_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_feedback_criteria" ADD CONSTRAINT "coach_feedback_criteria_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_issues" ADD CONSTRAINT "parent_issues_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_messages" ADD CONSTRAINT "issue_messages_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_order_items" ADD CONSTRAINT "merchandise_order_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_settings" ADD CONSTRAINT "configuration_settings_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_inquiries" ADD CONSTRAINT "public_inquiries_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

