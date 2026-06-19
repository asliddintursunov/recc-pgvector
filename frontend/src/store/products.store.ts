import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { Product } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
    product: Product;
    quantity: number;
};

type ProductsState = {
    cart: CartItem[];
    selectedProductIds: string[];
    addProduct: (product: Product) => void;
    increaseProduct: (productId: string) => void;
    decreaseProduct: (productId: string) => void;
    removeProduct: (productId: string) => void;
    toggleSelectedProduct: (productId: string) => void;
    selectAllProducts: () => void;
    clearSelectedProducts: () => void;
    clearCart: () => void;
};

function keepSelectedProductsInCart(cart: CartItem[], selectedProductIds: string[]) {
    const cartProductIds = new Set(cart.map((item) => item.product.id));
    return selectedProductIds.filter((productId) => cartProductIds.has(productId));
}

export const useProductsStore = create<ProductsState>()(
    persist(
        (set) => ({
            cart: [],
            selectedProductIds: [],
            addProduct: (product) =>
                set((state) => {
                    const existingItem = state.cart.find((item) => item.product.id === product.id);

                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    }

                    return {
                        cart: [...state.cart, { product, quantity: 1 }],
                        selectedProductIds: [...state.selectedProductIds, product.id],
                    };
                }),
            increaseProduct: (productId) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.product.id === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                })),
            decreaseProduct: (productId) =>
                set((state) => {
                    const cart = state.cart
                        .map((item) =>
                            item.product.id === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item,
                        )
                        .filter((item) => item.quantity > 0);

                    return {
                        cart,
                        selectedProductIds: keepSelectedProductsInCart(
                            cart,
                            state.selectedProductIds,
                        ),
                    };
                }),
            removeProduct: (productId) =>
                set((state) => {
                    const cart = state.cart.filter((item) => item.product.id !== productId);

                    return {
                        cart,
                        selectedProductIds: state.selectedProductIds.filter((id) => id !== productId),
                    };
                }),
            toggleSelectedProduct: (productId) =>
                set((state) => ({
                    selectedProductIds: state.selectedProductIds.includes(productId)
                        ? state.selectedProductIds.filter((id) => id !== productId)
                        : [...state.selectedProductIds, productId],
                })),
            selectAllProducts: () =>
                set((state) => ({
                    selectedProductIds: state.cart.map((item) => item.product.id),
                })),
            clearSelectedProducts: () => set({ selectedProductIds: [] }),
            clearCart: () => set({ cart: [], selectedProductIds: [] }),
        }),
        {
            name: LOCAL_STORAGE_KEYS.PRODUCTS,
            storage: createJSONStorage(() => localStorage),
            partialize: ({ cart, selectedProductIds }) => ({
                cart,
                selectedProductIds: keepSelectedProductsInCart(cart, selectedProductIds),
            }),
        },
    ),
);
