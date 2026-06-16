import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { formatCurrency } from "../lib/pricing";
import { useCart } from "../hooks/useCart";
import { useOrderStore } from "../stores/orderStore";
import { useToastStore } from "../stores/toastStore";
import type { CheckoutDetails } from "../types";

export function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const createOrder = useOrderStore((state) => state.createOrder);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const [details, setDetails] = useState<CheckoutDetails>({
    fullName: "",
    email: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    globalThis.setTimeout(() => {
      const order = createOrder(items, details);
      clearCart();
      addToast({
        title: "Order confirmed",
        description: `${order.id} was saved locally.`,
        tone: "success",
      });
      navigate("/orders", { replace: true });
    }, 500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-950">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-500">
          This creates a local order record because the backend does not expose order endpoints yet.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Full name</span>
            <input
              value={details.fullName}
              onChange={(event) => setDetails({ ...details, fullName: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <input
              value={details.email}
              onChange={(event) => setDetails({ ...details, email: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              type="email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Delivery address</span>
            <textarea
              value={details.address}
              onChange={(event) => setDetails({ ...details, address: event.target.value })}
              className="mt-1 min-h-28 w-full rounded-md border border-zinc-200 px-3 py-3 text-sm transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Confirming..." : "Confirm order"}
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-950">Summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between gap-4 text-sm">
              <span className="line-clamp-1 text-zinc-600">
                {item.quantity} x {item.product.title}
              </span>
              <span className="shrink-0 font-medium text-zinc-950">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Tax</span>
            <span>{formatCurrency(totals.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Shipping</span>
            <span>{formatCurrency(totals.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold text-zinc-950">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
