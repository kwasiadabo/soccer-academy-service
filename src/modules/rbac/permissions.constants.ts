export const PERMISSIONS = {
  ACADEMY_CONFIG_MANAGE: 'academy-config:manage',
  ACADEMY_CONFIG_VIEW: 'academy-config:view',
  USERS_MANAGE: 'users:manage',
  PLAYERS_MANAGE: 'players:manage',
  PLAYERS_VIEW: 'players:view',
  FINANCE_MANAGE: 'finance:manage',
  FINANCE_VIEW: 'finance:view',
  TRAINING_MANAGE_OWN: 'training:manage-own',
  TRAINING_APPROVE: 'training:approve',
  TRAINING_ATTENDANCE_RECORD: 'training:attendance-record',
  ASSESSMENTS_MANAGE_OWN: 'assessments:manage-own',
  ASSESSMENTS_VIEW: 'assessments:view',
  ASSESSMENTS_MANAGE_TEMPLATES: 'assessments:manage-templates',
  MATCHES_MANAGE: 'matches:manage',
  COACHES_MANAGE: 'coaches:manage',
  TEAMS_MANAGE: 'teams:manage',
  PLAYERS_TEAM_ASSIGN: 'players:team-assign',
  PLAYERS_STATUS_MANAGE: 'players:status-manage',
  PARENT_PORTAL_ACCESS: 'parent-portal:access',
  AUDIT_VIEW: 'audit:view',
  ISSUES_MANAGE: 'issues:manage',
  ORDERS_MANAGE: 'orders:manage',
  GALLERY_MANAGE: 'gallery:manage',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_NAMES = {
  ADMIN: 'System Administrator',
  RECEPTIONIST: 'Receptionist',
  HEAD_COACH: 'Head Coach',
  COACH: 'Coach',
  PARENT: 'Parent',
  PLAYER: 'Player',
} as const;

export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  [ROLE_NAMES.ADMIN]: Object.values(PERMISSIONS),
  [ROLE_NAMES.RECEPTIONIST]: [
    PERMISSIONS.ACADEMY_CONFIG_VIEW,
    PERMISSIONS.PLAYERS_MANAGE,
    PERMISSIONS.PLAYERS_VIEW,
    PERMISSIONS.FINANCE_MANAGE,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.TRAINING_ATTENDANCE_RECORD,
    PERMISSIONS.ISSUES_MANAGE,
    // Lets a Receptionist process merchandise orders and manage the product catalog,
    // same staff set as ISSUES_MANAGE.
    PERMISSIONS.ORDERS_MANAGE,
    // Lets a Receptionist upload/replace the public marketing-site gallery photos
    // (Saturday training / match day), same staff set as ISSUES_MANAGE.
    PERMISSIONS.GALLERY_MANAGE,
  ],
  [ROLE_NAMES.HEAD_COACH]: [
    PERMISSIONS.ACADEMY_CONFIG_VIEW,
    PERMISSIONS.PLAYERS_VIEW,
    PERMISSIONS.TRAINING_APPROVE,
    PERMISSIONS.ASSESSMENTS_VIEW,
    // Lets a Head Coach submit ratings, but only for sessions/matches they were
    // personally in charge of — see CoachContextService#assertOwnsOrConductedSession
    // and MatchesService#addPlayerAssessment for the ownership check that scopes it.
    PERMISSIONS.ASSESSMENTS_MANAGE_OWN,
    PERMISSIONS.ASSESSMENTS_MANAGE_TEMPLATES,
    PERMISSIONS.MATCHES_MANAGE,
    PERMISSIONS.COACHES_MANAGE,
    // Narrower than ACADEMY_CONFIG_MANAGE (which also covers seasons/age categories) —
    // lets a Head Coach create/edit teams without granting the rest of academy setup.
    PERMISSIONS.TEAMS_MANAGE,
    // Narrower than PLAYERS_MANAGE (which also covers editing a player's personal/medical/
    // guardian details) — lets a Head Coach move a player between teams/training groups,
    // or remove them from one, without granting full player-record editing.
    PERMISSIONS.PLAYERS_TEAM_ASSIGN,
    // Lets a Head Coach suspend/withdraw/reinstate a player's registration status —
    // distinct from PLAYERS_TEAM_ASSIGN (roster membership) and narrower than
    // PLAYERS_MANAGE (full record editing).
    PERMISSIONS.PLAYERS_STATUS_MANAGE,
    // Read-only — lets a Head Coach see each player's payment/financial status without
    // granting FINANCE_MANAGE (recording payments, waiving fees, etc.).
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.ISSUES_MANAGE,
    // Lets a Head Coach process merchandise orders and manage the product catalog,
    // same staff set as ISSUES_MANAGE.
    PERMISSIONS.ORDERS_MANAGE,
    // Lets a Head Coach upload/replace the public marketing-site gallery photos
    // (Saturday training / match day), same staff set as ISSUES_MANAGE.
    PERMISSIONS.GALLERY_MANAGE,
  ],
  [ROLE_NAMES.COACH]: [
    PERMISSIONS.PLAYERS_VIEW,
    PERMISSIONS.TRAINING_MANAGE_OWN,
    PERMISSIONS.ASSESSMENTS_MANAGE_OWN,
    PERMISSIONS.MATCHES_MANAGE,
  ],
  [ROLE_NAMES.PARENT]: [PERMISSIONS.PARENT_PORTAL_ACCESS],
  [ROLE_NAMES.PLAYER]: [PERMISSIONS.PARENT_PORTAL_ACCESS],
};
