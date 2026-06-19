import type { Product } from "@/types"

export default function ProductImage({ product }: { product: Product }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-muted">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="size-full object-cover"
        />
      ) : (
        <span className="px-4 text-center text-sm font-medium text-muted-foreground">
          {product.title}
        </span>
      )}
    </div>
  )
}
