import { ROUTES } from "./routes.constant";
import { Box, House, LayoutDashboard, ShoppingBasket, UserRound, UsersRound, type LucideIcon } from "lucide-react"
import type { UserRole } from "@/types";

type SidebarOption = {
    name: string;
    route: string;
    icon: LucideIcon;
    roles?: UserRole[];
};

export const SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        name: "Main",
        route: ROUTES.MAIN,
        icon: House,
        roles: ["customer"],
    },
    {
        name: "Products",
        route: ROUTES.PRODUCTS.ROOT,
        icon: Box,
        roles: ["customer", "merchant"],
    },
    {
        name: "Purchases",
        route: ROUTES.PURCHASES.ROOT,
        icon: ShoppingBasket,
        roles: ["customer"],
    },
    {
        name: "Dashboard",
        route: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: ["admin"],
    },
    {
        name: "Profile",
        route: ROUTES.PROFILE,
        icon: UserRound
    },
    {
        name: "Users",
        route: ROUTES.USERS.ROOT,
        icon: UsersRound,
        roles: ["admin"],
    }
] 
