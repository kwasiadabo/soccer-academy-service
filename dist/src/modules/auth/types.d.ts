export interface JwtPayload {
    sub: string;
    email: string;
    roles: string[];
    permissions: string[];
}
export interface RequestUser {
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
    mustChangePassword: boolean;
}
export interface AuthenticatedRequest {
    user?: RequestUser;
}
