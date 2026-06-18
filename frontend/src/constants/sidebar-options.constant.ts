import { ROUTES } from "./routes.constant";
import { Box, ShoppingBasket, UserRound, UsersRound } from "lucide-react"

export const SIDEBAR_OPTIONS = [
    {
        name: "Products",
        route: ROUTES.PRODUCTS.ROOT,
        icon: Box
    },
    {
        name: "Purchases",
        route: ROUTES.PURCHASES.ROOT,
        icon: ShoppingBasket
    },
    {
        name: "Profile",
        route: ROUTES.PROFILE,
        icon: UserRound
    },
    {
        name: "Users",
        route: ROUTES.USERS.ROOT,
        icon: UsersRound
    }
]