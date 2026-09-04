export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleNames: string[];
    mustChangePassword?: boolean;
}
