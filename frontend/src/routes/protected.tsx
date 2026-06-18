import { ROUTES } from "@/constants"
import localstorage from "@/lib/local-storage.lib"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const location = useLocation()
  const token = localstorage.get("authToken")

  if (!token) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />
  }

  return <Outlet />
}
