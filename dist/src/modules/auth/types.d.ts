export interface JwtPayload {
    sub: string;
    academyId: string;
    email: string;
    roles: string[];
    permissions: string[];
}
export interface RequestUser {
    userId: string;
    academyId: string;
    email: string;
    roles: string[];
    permissions: string[];
    mustChangePassword: boolean;
}
export interface AuthenticatedRequest {
    user?: RequestUser;
}
