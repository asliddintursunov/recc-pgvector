import { Search, SlidersHorizontal } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pagination } from "../components/Pagination";
import { ProductCard } from "../components/ProductCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  useCreateInteractionMutation,
  useProductsQuery,
  useRecommendedProductsQuery,
} from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useToastStore } from "../stores/toastStore";
import type { Product, ProductTag } from "../types";

const productTags: ProductTag[] = [
  "new",
  "used",
  "gaming",
  "electronics",
  "audio",
  "wireless",
  "laptop",
  "smartphone",
  "home_appliance",
  "furniture",
  "fitness",
  "books",
];

const pageSize = 12;

const normalize = (value: string): string => value.toLowerCase().trim();
const tagLabel = (tag: ProductTag): string => tag.replace("_", " ");

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<ProductTag | "all">("all");
  const [page, setPage] = useState(1);
  const productsQuery = useProductsQuery();
  const recommendedQuery = useRecommendedProductsQuery();
  const interactionMutation = useCreateInteractionMutation();
  const { addItem } = useCart();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (productsQuery.error) {
      addToast({
        title: "Products failed to load",
        description: productsQuery.error.message,
        tone: "error",
      });
    }
  }, [addToast, productsQuery.error]);

  useEffect(() => {
    if (recommendedQuery.error) {
      addToast({
        title: "Recommendations failed to load",
        description: recommendedQuery.error.message,
        tone: "error",
      });
    }
  }, [addToast, recommendedQuery.error]);

  const products = productsQuery.data ?? [];

  const filteredProducts = useMemo(() => {
    const searchValue = normalize(submittedSearch);

    return products.filter((product) => {
      const matchesSearch =
        searchValue.length === 0 ||
        normalize(product.title).includes(searchValue) ||
        normalize(product.description ?? "").includes(searchValue) ||
        product.tags.some((tag) => normalize(tag).includes(searchValue));
      const matchesTag = selectedTag === "all" || product.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [products, selectedTag, submittedSearch]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    addToast({ title: "Added to cart", description: product.title, tone: "success" });
  };

  const handleLike = (product: Product) => {
    interactionMutation.mutate({ productId: product.id, actionType: "like" });
  };

  const handleOpen = (product: Product) => {
    if (submittedSearch.trim().length > 0) {
      interactionMutation.mutate({ productId: product.id, actionType: "search" });
    }
  };

  if (productsQuery.isLoading) {
    return <LoadingSpinner label="Loading marketplace" />;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">
              Marketplace
            </p>
            <h1 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">Products</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Browse seeded products and train recommendations with likes, searches, and product
              views.
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-950 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Search products, tags, descriptions"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </div>
          <select
            value={selectedTag}
            onChange={(event) => {
              setSelectedTag(event.target.value as ProductTag | "all");
              setPage(1);
            }}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm capitalize text-zinc-700 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All tags</option>
            {productTags.map((tag) => (
              <option key={tag} value={tag}>
                {tagLabel(tag)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {recommendedQuery.data && recommendedQuery.data.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Recommended for you</h2>
              <p className="text-sm text-zinc-500">Updated from your interaction history.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedQuery.data.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onAddToCart={handleAddToCart}
                onLike={handleLike}
                onOpen={handleOpen}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">All products</h2>
            <p className="text-sm text-zinc-500">{filteredProducts.length} matching products</p>
          </div>
        </div>

        {productsQuery.error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {productsQuery.error.message}
          </div>
        ) : null}

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center">
            <p className="font-semibold text-zinc-950">No products found</p>
            <p className="mt-2 text-sm text-zinc-500">Try a different search or tag filter.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onLike={handleLike}
                  onOpen={handleOpen}
                />
              ))}
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filteredProducts.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
