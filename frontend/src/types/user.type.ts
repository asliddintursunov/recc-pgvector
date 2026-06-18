import type { UserRole } from "./auth.type";

export interface UserProfile {
    id: string;
    username: string;
    role: UserRole;
    createdAt: string;
}
