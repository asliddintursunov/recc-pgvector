import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ProductCard } from "../../components/ui/ProductCard";
import { useCreateInteraction } from "../../hooks/useSubmit";
import { useProducts, useRecommendedProducts } from "../../hooks/useGet";

export default function ProductsPage() {
  const recommendedQuery = useRecommendedProducts();
  const interactionMutation = useCreateInteraction();
  const {
    data: products,
    error: productsError,
    isLoading: productsLoading,
  } = useProducts();

  const handleInteraction = (
    productId: string,
    actionType: "click" | "like",
  ) => {
    interactionMutation.mutateAsync({ productId, actionType });
  };

  if (productsLoading || recommendedQuery.isLoading) {
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
            <h1 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              Products
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Browse seeded products and train recommendations with likes,
              searches, and product views.
            </p>
          </div>
        </div>
      </section>

      {recommendedQuery.data && recommendedQuery.data.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Recommended for you
              </h2>
              <p className="text-sm text-zinc-500">
                Updated from your interaction history.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedQuery.data.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onLike={(product) => handleInteraction(product.id, "like")}
                onOpen={(product) => handleInteraction(product.id, "click")}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              All products
            </h2>
          </div>
        </div>

        {productsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {productsError.message}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={(product) => handleInteraction(product.id, "like")}
              onOpen={(product) => handleInteraction(product.id, "click")}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
