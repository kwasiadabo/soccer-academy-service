export interface PlatformAdminJwtPayload {
  sub: string;
  email: string;
}

export interface RequestPlatformAdmin {
  adminId: string;
  email: string;
}

export interface AuthenticatedPlatformAdminRequest {
  platformAdmin?: RequestPlatformAdmin;
}
