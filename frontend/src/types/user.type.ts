import type { AuthRole } from "./auth.type";

export type UserRole = AuthRole | "admin";

export interface UserProfile {
    id: string;
    username: string;
    role: UserRole;
    createdAt: string;
}
