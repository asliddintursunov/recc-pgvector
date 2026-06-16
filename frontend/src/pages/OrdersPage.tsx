import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { formatCurrency } from "../lib/pricing";
import { useOrderStore } from "../stores/orderStore";

export function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <PackageOpen className="mx-auto h-12 w-12 text-zinc-300" />
        <h1 className="mt-4 text-xl font-semibold text-zinc-950">No orders yet</h1>
        <p className="mt-2 text-sm text-zinc-500">Checkout orders will appear here.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">Local checkout history for this browser.</p>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold text-zinc-950">{order.id}</h2>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {new Date(order.createdAt).toLocaleString()} · {order.customer.fullName}
                </p>
              </div>
              <p className="text-lg font-bold text-zinc-950">{formatCurrency(order.total)}</p>
            </div>
            <div className="mt-4 grid gap-3">
              {order.items.map((item) => (
                <div
                  key={`${order.id}-${item.product.id}`}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-950">{item.product.title}</p>
                    <p className="text-zinc-500">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-zinc-950">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
