import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./pages/Auth";
import ProductDetailPage from "./pages/Products/Detail";
import ProductsPage from "./pages/Products";
import localstorage from "./lib/local-storage.lib";
import type { ReactElement } from "react";
import { ROUTES } from "./constants/route.constant";
import RootLayout from "./layout/RootLayout";

interface ProtectedRouteProps {
  children: ReactElement;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!localstorage.get("authToken")) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />;
  }

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.PRODUCTS} replace />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.PRODUCTS} replace />} />
    </Routes>
  );
}
