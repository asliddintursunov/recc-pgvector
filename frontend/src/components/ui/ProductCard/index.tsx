import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/cn.lib";
import type { Product } from "../../../types";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  onLike: (product: Product) => void;
  onOpen?: (product: Product) => void;
}

const tagLabel = (tag: string): string => tag.replace("_", " ");

const getPanelClassName = (product: Product): string => {
  if (product.tags.includes("laptop") || product.tags.includes("electronics")) {
    return "from-indigo-600 to-sky-500";
  }

  if (product.tags.includes("audio") || product.tags.includes("wireless")) {
    return "from-fuchsia-600 to-indigo-500";
  }

  if (
    product.tags.includes("furniture") ||
    product.tags.includes("home_appliance")
  ) {
    return "from-emerald-600 to-teal-500";
  }

  if (product.tags.includes("fitness")) {
    return "from-rose-600 to-orange-500";
  }

  return "from-zinc-800 to-zinc-500";
};

export function ProductCard({
  product,
  compact = false,
  onLike,
  onOpen,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-soft">
      <Link
        to={`/products/${product.id}`}
        onClick={() => onOpen?.(product)}
        className="block"
      >
        <div
          className={cn(
            "relative bg-gradient-to-br",
            getPanelClassName(product),
            compact ? "h-28" : "h-40",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.18),transparent_22%)]" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {product.tags[0] ? tagLabel(product.tags[0]) : "marketplace"}
            </p>
            <p className="mt-1 line-clamp-2 text-lg font-semibold leading-6 text-white">
              {product.title}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium capitalize text-zinc-600"
            >
              {tagLabel(tag)}
            </span>
          ))}
        </div>
        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-600">
          {product.description ?? "No description provided."}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLike(product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              aria-label={`Like ${product.title}`}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
