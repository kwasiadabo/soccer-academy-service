-- New platform-billing permission (see permissions.constants.ts BILLING_MANAGE).
-- Role/Permission/RolePermission are global, shared reference data (not
-- per-academy — see the Tenancy note in schema.prisma), so this is a single
-- insert rather than a per-academy loop: every academy's System Administrator
-- role is the same shared row.
INSERT INTO "permissions" ("id", "key", "description", "createdAt")
VALUES (gen_random_uuid(), 'billing:manage', 'Manage this academy''s SAMS subscription and billing', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "role_permissions" ("id", "roleId", "permissionId")
SELECT gen_random_uuid(), r."id", p."id"
FROM "roles" r, "permissions" p
WHERE r."name" = 'System Administrator' AND p."key" = 'billing:manage'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
