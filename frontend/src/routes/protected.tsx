import { ROUTES } from "@/constants"
import Layout from "@/layouts/Layout"
import { useProfileStore, useTokenStore } from "@/store"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function ProtectedRoute() {
  const location = useLocation()
  const { accessToken } = useTokenStore()
  const { profile } = useProfileStore()

  if (!accessToken || !profile) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
