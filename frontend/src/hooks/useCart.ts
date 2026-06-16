import { useCartStore, selectCartCount, selectCartTotals } from "../stores/cartStore";

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const count = useCartStore(selectCartCount);
  const totals = useCartStore(selectCartTotals);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    count,
    totals,
  };
};
