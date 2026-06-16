import {
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../../lib/cn.lib";
import { toast } from "react-hot-toast";
import localstorage from "../../../lib/local-storage.lib";
import { Button } from "../Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
  );

export function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localstorage.remove("authToken");
    toast.success("Signed out successfully.");
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
            <Button>
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
        {mobileOpen ? (
          <nav className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
            <div className="grid gap-2">
              <NavLink
                to="/products"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <Package className="mr-2 inline h-4 w-4" />
                Products
              </NavLink>
              <NavLink
                to="/cart"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingCart className="mr-2 inline h-4 w-4" />
                Cart
              </NavLink>
              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                <UserCircle className="mr-2 inline h-4 w-4" />
                Orders
              </NavLink>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
