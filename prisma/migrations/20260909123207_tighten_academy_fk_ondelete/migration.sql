-- DropForeignKey
ALTER TABLE "age_categories" DROP CONSTRAINT "age_categories_academyId_fkey";

-- DropForeignKey
ALTER TABLE "assessment_criteria" DROP CONSTRAINT "assessment_criteria_academyId_fkey";

-- DropForeignKey
ALTER TABLE "assessment_ratings" DROP CONSTRAINT "assessment_ratings_academyId_fkey";

-- DropForeignKey
ALTER TABLE "assessment_templates" DROP CONSTRAINT "assessment_templates_academyId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coach_assignments" DROP CONSTRAINT "coach_assignments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coach_feedback" DROP CONSTRAINT "coach_feedback_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coach_feedback_criteria" DROP CONSTRAINT "coach_feedback_criteria_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coach_qualifications" DROP CONSTRAINT "coach_qualifications_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coach_remarks" DROP CONSTRAINT "coach_remarks_academyId_fkey";

-- DropForeignKey
ALTER TABLE "coaches" DROP CONSTRAINT "coaches_academyId_fkey";

-- DropForeignKey
ALTER TABLE "configuration_settings" DROP CONSTRAINT "configuration_settings_academyId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_academyId_fkey";

-- DropForeignKey
ALTER TABLE "fee_items" DROP CONSTRAINT "fee_items_academyId_fkey";

-- DropForeignKey
ALTER TABLE "fee_structures" DROP CONSTRAINT "fee_structures_academyId_fkey";

-- DropForeignKey
ALTER TABLE "fee_type_items" DROP CONSTRAINT "fee_type_items_academyId_fkey";

-- DropForeignKey
ALTER TABLE "fee_types" DROP CONSTRAINT "fee_types_academyId_fkey";

-- DropForeignKey
ALTER TABLE "financial_adjustments" DROP CONSTRAINT "financial_adjustments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "gallery_photos" DROP CONSTRAINT "gallery_photos_academyId_fkey";

-- DropForeignKey
ALTER TABLE "guardians" DROP CONSTRAINT "guardians_academyId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_academyId_fkey";

-- DropForeignKey
ALTER TABLE "issue_messages" DROP CONSTRAINT "issue_messages_academyId_fkey";

-- DropForeignKey
ALTER TABLE "match_participations" DROP CONSTRAINT "match_participations_academyId_fkey";

-- DropForeignKey
ALTER TABLE "match_player_assessments" DROP CONSTRAINT "match_player_assessments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_academyId_fkey";

-- DropForeignKey
ALTER TABLE "merchandise_order_items" DROP CONSTRAINT "merchandise_order_items_academyId_fkey";

-- DropForeignKey
ALTER TABLE "merchandise_orders" DROP CONSTRAINT "merchandise_orders_academyId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_academyId_fkey";

-- DropForeignKey
ALTER TABLE "opponents" DROP CONSTRAINT "opponents_academyId_fkey";

-- DropForeignKey
ALTER TABLE "parent_issues" DROP CONSTRAINT "parent_issues_academyId_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_academyId_fkey";

-- DropForeignKey
ALTER TABLE "payment_allocations" DROP CONSTRAINT "payment_allocations_academyId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "player_assessments" DROP CONSTRAINT "player_assessments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "player_group_assignments" DROP CONSTRAINT "player_group_assignments_academyId_fkey";

-- DropForeignKey
ALTER TABLE "player_guardians" DROP CONSTRAINT "player_guardians_academyId_fkey";

-- DropForeignKey
ALTER TABLE "player_of_the_week" DROP CONSTRAINT "player_of_the_week_academyId_fkey";

-- DropForeignKey
ALTER TABLE "player_registrations" DROP CONSTRAINT "player_registrations_academyId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_academyId_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_academyId_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_academyId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_academyId_fkey";

-- DropForeignKey
ALTER TABLE "public_inquiries" DROP CONSTRAINT "public_inquiries_academyId_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_academyId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_activities" DROP CONSTRAINT "training_activities_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_activity_marks" DROP CONSTRAINT "training_activity_marks_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_approvals" DROP CONSTRAINT "training_approvals_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_attendance" DROP CONSTRAINT "training_attendance_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_groups" DROP CONSTRAINT "training_groups_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_plans" DROP CONSTRAINT "training_plans_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_session_activities" DROP CONSTRAINT "training_session_activities_academyId_fkey";

-- DropForeignKey
ALTER TABLE "training_sessions" DROP CONSTRAINT "training_sessions_academyId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_academyId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_academyId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "age_categories" ADD CONSTRAINT "age_categories_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_groups" ADD CONSTRAINT "training_groups_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "guardians_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_guardians" ADD CONSTRAINT "player_guardians_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_registrations" ADD CONSTRAINT "player_registrations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_group_assignments" ADD CONSTRAINT "player_group_assignments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_types" ADD CONSTRAINT "fee_types_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fee_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_type_items" ADD CONSTRAINT "fee_type_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_adjustments" ADD CONSTRAINT "financial_adjustments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_qualifications" ADD CONSTRAINT "coach_qualifications_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activities" ADD CONSTRAINT "training_activities_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_activity_marks" ADD CONSTRAINT "training_activity_marks_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_approvals" ADD CONSTRAINT "training_approvals_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_of_the_week" ADD CONSTRAINT "player_of_the_week_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_activities" ADD CONSTRAINT "training_session_activities_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_attendance" ADD CONSTRAINT "training_attendance_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_criteria" ADD CONSTRAINT "assessment_criteria_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_assessments" ADD CONSTRAINT "player_assessments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_ratings" ADD CONSTRAINT "assessment_ratings_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_remarks" ADD CONSTRAINT "coach_remarks_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opponents" ADD CONSTRAINT "opponents_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participations" ADD CONSTRAINT "match_participations_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_player_assessments" ADD CONSTRAINT "match_player_assessments_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_feedback" ADD CONSTRAINT "coach_feedback_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_feedback_criteria" ADD CONSTRAINT "coach_feedback_criteria_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_issues" ADD CONSTRAINT "parent_issues_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_messages" ADD CONSTRAINT "issue_messages_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_orders" ADD CONSTRAINT "merchandise_orders_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchandise_order_items" ADD CONSTRAINT "merchandise_order_items_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuration_settings" ADD CONSTRAINT "configuration_settings_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_inquiries" ADD CONSTRAINT "public_inquiries_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

