import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useProductsStore } from "@/store";
import type { Product } from "@/types";

type Props = {
    product: Product;
    size?: ComponentProps<typeof Button>["size"];
    className?: string;
};

export default function CartActions({ product, size = "sm", className }: Props) {
    const { cart, addProduct, increaseProduct, decreaseProduct } = useProductsStore();
    const cartItem = cart.find((item) => item.product.id === product.id);

    if (!cartItem) {
        return (
            <Button size={size} className={className} onClick={() => addProduct(product)}>
                <ShoppingCart />
                <span>Add to cart</span>
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                size={size === "default" ? "icon" : "icon-sm"}
                variant="outline"
                aria-label={`Remove one ${product.title}`}
                onClick={() => decreaseProduct(product.id)}
            >
                <Minus />
            </Button>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium">
                {cartItem.quantity}
            </span>
            <Button
                size={size === "default" ? "icon" : "icon-sm"}
                aria-label={`Add one ${product.title}`}
                onClick={() => increaseProduct(product.id)}
            >
                <Plus />
            </Button>
        </div>
    );
}
