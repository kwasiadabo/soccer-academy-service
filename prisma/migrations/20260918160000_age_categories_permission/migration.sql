-- New age-categories:manage permission (see permissions.constants.ts
-- AGE_CATEGORIES_MANAGE), carved out of academy-config:manage the same way
-- teams:manage was, so a Head Coach can set up age categories without the
-- rest of academy setup (seasons/training groups).
--
-- Role/Permission/RolePermission are global, shared reference data (not
-- per-academy — see the Tenancy note in schema.prisma), so this is a single
-- insert rather than a per-academy loop: every academy's Head Coach role is
-- the same shared row.
INSERT INTO "permissions" ("id", "key", "description", "createdAt")
VALUES (gen_random_uuid(), 'age-categories:manage', 'Create and update this academy''s age categories', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "role_permissions" ("id", "roleId", "permissionId")
SELECT gen_random_uuid(), r."id", p."id"
FROM "roles" r, "permissions" p
WHERE r."name" = 'Head Coach' AND p."key" = 'age-categories:manage'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
