import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/pricing";
import { useCart } from "../hooks/useCart";

export function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300" />
        <h1 className="mt-4 text-xl font-semibold text-zinc-950">Your cart is empty</h1>
        <p className="mt-2 text-sm text-zinc-500">Add products before starting checkout.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-950">Cart</h1>
            <p className="text-sm text-zinc-500">{items.length} products ready for checkout</p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Clear cart
          </button>
        </div>
        <div className="divide-y divide-zinc-200">
          {items.map((item) => (
            <div key={item.product.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Link
                  to={`/products/${item.product.id}`}
                  className="font-semibold text-zinc-950 transition hover:text-indigo-700"
                >
                  {item.product.title}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {item.product.description ?? "No description provided."}
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-950">
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="inline-flex items-center rounded-md border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-2 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-2 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="w-24 text-right text-sm font-semibold text-zinc-950">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="rounded-md p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${item.product.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-950">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span className="font-medium text-zinc-950">{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Tax</span>
            <span className="font-medium text-zinc-950">{formatCurrency(totals.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Shipping</span>
            <span className="font-medium text-zinc-950">{formatCurrency(totals.shipping)}</span>
          </div>
          <div className="border-t border-zinc-200 pt-3">
            <div className="flex justify-between text-base">
              <span className="font-semibold text-zinc-950">Total</span>
              <span className="font-bold text-zinc-950">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
        <Link
          to="/checkout"
          className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
