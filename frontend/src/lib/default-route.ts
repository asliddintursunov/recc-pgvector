import { ROUTES } from "@/constants";
import type { UserRole } from "@/types";

export function getDefaultRoute(role: UserRole) {
    if (role === "admin") {
        return ROUTES.DASHBOARD;
    }

    if (role === "customer") {
        return ROUTES.MAIN;
    }

    return ROUTES.PRODUCTS.ROOT;
}
