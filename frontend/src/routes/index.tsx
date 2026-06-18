/* eslint-disable react-refresh/only-export-components */
import { ROUTES } from "@/constants"

import { lazy } from "react"
import { Navigate, type RouteObject } from "react-router-dom"
import ProtectedRoute from "./protected"

const AuthPage = lazy(() => import("@/pages/auth"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))
const ProductsPage = lazy(() => import("@/pages/products"))
const ProductDetailPage = lazy(() => import("@/pages/products/details"))
const UsersPage = lazy(() => import("@/pages/users"))
const UsersDetailPage = lazy(() => import("@/pages/users/details"))
const PurchasesPage = lazy(() => import("@/pages/purchases"))
const PurchasesDetailPage = lazy(() => import("@/pages/purchases/details"))
const ProfilePage = lazy(() => import("@/pages/profile"))

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.PRODUCTS.ROOT} replace />,
  },
  {
    path: ROUTES.AUTH,
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.PRODUCTS.ROOT,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.PRODUCTS.DETAIL,
        element: <ProductDetailPage />,
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
