import { ROUTES } from "./routes.constant";
import { Box, ShoppingBasket, ShoppingCart, UserRound, UsersRound, type LucideIcon } from "lucide-react"
import type { UserRole } from "@/types";

type SidebarOption = {
    name: string;
    route: string;
    icon: LucideIcon;
    roles?: UserRole[];
};

export const SIDEBAR_OPTIONS: SidebarOption[] = [
    {
        name: "Products",
        route: ROUTES.PRODUCTS.ROOT,
        icon: Box
    },
    {
        name: "Cart",
        route: ROUTES.CART,
        icon: ShoppingCart,
        roles: ["customer"],
    },
    {
        name: "Purchases",
        route: ROUTES.PURCHASES.ROOT,
        icon: ShoppingBasket,
        roles: ["admin", "customer"],
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
