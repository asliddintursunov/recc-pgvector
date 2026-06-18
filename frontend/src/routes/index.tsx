import { ROUTES } from "@/constants"

import { lazy } from "react"
import { Navigate, type RouteObject } from "react-router-dom"
import ProtectedRoute from "./protected"

const AuthPage = lazy(() => import("@/pages/auth"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))
const ProductsPage = lazy(() => import("@/pages/products"))
const ProductDetailPage = lazy(() => import("@/pages/products/details"))

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.PRODUCTS} replace />,
  },
  {
    path: ROUTES.AUTH,
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.PRODUCT_DETAIL,
        element: <ProductDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]
