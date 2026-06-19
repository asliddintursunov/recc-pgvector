/* eslint-disable react-refresh/only-export-components */
import { ROUTES } from "@/constants"
import { getDefaultRoute } from "@/lib"
import { useProfileStore, useTokenStore } from "@/store"

import { lazy } from "react"
import { Navigate, type RouteObject } from "react-router-dom"
import ProtectedRoute from "./protected"

const AuthPage = lazy(() => import("@/pages/auth"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))
const MainPage = lazy(() => import("@/pages/main"))
const DashboardPage = lazy(() => import("@/pages/dashboard"))
const ProductsPage = lazy(() => import("@/pages/products"))
const ProductDetailPage = lazy(() => import("@/pages/products/details"))
const CartPage = lazy(() => import("@/pages/cart"))
const UsersPage = lazy(() => import("@/pages/users"))
const UsersDetailPage = lazy(() => import("@/pages/users/details"))
const PurchasesPage = lazy(() => import("@/pages/purchases"))
const PurchasesDetailPage = lazy(() => import("@/pages/purchases/details"))
const ProfilePage = lazy(() => import("@/pages/profile"))

function DefaultRoute() {
  const { accessToken } = useTokenStore()
  const { profile } = useProfileStore()

  if (!accessToken || !profile) {
    return <Navigate to={ROUTES.AUTH} replace />
  }

  return <Navigate to={getDefaultRoute(profile.role)} replace />
}

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    element: <DefaultRoute />,
  },
  {
    path: ROUTES.AUTH,
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.MAIN,
        element: <MainPage />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.PRODUCTS.ROOT,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.PRODUCTS.DETAIL,
        element: <ProductDetailPage />,
      },
      {
        path: ROUTES.CART,
        element: <CartPage />,
      },
      {
        path: ROUTES.USERS.ROOT,
        element: <UsersPage />,
      },
      {
        path: ROUTES.USERS.DETAIL,
        element: <UsersDetailPage />,
      },
      {
        path: ROUTES.PURCHASES.ROOT,
        element: <PurchasesPage />,
      },
      {
        path: ROUTES.PURCHASES.DETAIL,
        element: <PurchasesDetailPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]
