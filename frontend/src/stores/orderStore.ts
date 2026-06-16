import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getOrderTotals } from "../lib/pricing";
import type { CartItem, CheckoutDetails, LocalOrder } from "../types";

interface OrderState {
  orders: LocalOrder[];
  createOrder: (items: CartItem[], customer: CheckoutDetails) => LocalOrder;
  clearOrders: () => void;
}

const createOrderId = (): string => `ORD-${Date.now().toString(36).toUpperCase()}`;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      createOrder: (items, customer) => {
        const totals = getOrderTotals(items);
        const order: LocalOrder = {
          id: createOrderId(),
          items,
          ...totals,
          status: "confirmed",
          customer,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "recomart-orders",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
