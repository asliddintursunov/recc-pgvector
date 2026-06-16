import { LogOut, Menu, Package, ShoppingBag, ShoppingCart, UserCircle } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "../hooks/useCart";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
  }`;

export function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAccessToken();
    addToast({ title: "Signed out", tone: "info" });
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-zinc-950">RecoMart</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              Cart
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:border-indigo-200 hover:text-indigo-700"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-red-200 hover:text-red-600 sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 md:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <nav className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
            <div className="grid gap-2">
              <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <Package className="mr-2 inline h-4 w-4" />
                Products
              </NavLink>
              <NavLink to="/cart" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <ShoppingCart className="mr-2 inline h-4 w-4" />
                Cart
              </NavLink>
              <NavLink to="/orders" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <UserCircle className="mr-2 inline h-4 w-4" />
                Orders
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="mr-2 inline h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
