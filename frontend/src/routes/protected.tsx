import { ROUTES } from "@/constants"
import Layout from "@/layouts/Layout"
import localstorage from "@/lib/local-storage.lib"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const location = useLocation()
  const token = localstorage.get("authToken")
  const role = localstorage.get("authRole")

  if (!token || !role) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
