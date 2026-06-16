import type { CartItem, Product } from "../types";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const calculateProductPrice = (product: Product): number => {
  const seed = `${product.id}${product.title}${product.tags.join("")}`;
  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const tagPremium = product.tags.includes("laptop")
    ? 780
    : product.tags.includes("smartphone")
      ? 520
      : product.tags.includes("electronics")
        ? 240
        : product.tags.includes("furniture")
          ? 180
          : 60;

  return Math.round((tagPremium + 40 + (hash % 420)) / 5) * 5;
};

export const getOrderTotals = (
  items: CartItem[],
): Pick<CartItem, never> & { subtotal: number; tax: number; shipping: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 500 ? 24 : 0;
  const tax = Math.round(subtotal * 0.075);
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
};
