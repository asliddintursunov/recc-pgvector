import { Plus } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ProductCard } from "../../components/ui/ProductCard";
import {
  ProductMenu,
  type ProductMenuValues,
} from "../../components/ui/ProductMenu";
import { Button } from "../../components/ui/Button";
import {
  useCreateInteraction,
  useCreateProduct,
  useUpdateProduct,
} from "../../hooks/useSubmit";
import { useProducts, useRecommendedProducts } from "../../hooks/useGet";
import type { Product } from "../../types";

export default function ProductsPage() {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const recommendedQuery = useRecommendedProducts();
  const interactionMutation = useCreateInteraction();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
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

  const handleCreateProduct = async (values: ProductMenuValues) => {
    await createProductMutation.mutateAsync(values);
    setCreateMenuOpen(false);
  };

  const handleUpdateProduct = async (values: ProductMenuValues) => {
    if (!editingProduct) {
      return;
    }

    await updateProductMutation.mutateAsync({
      id: editingProduct.id,
      body: values,
    });
    setEditingProduct(null);
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
              Recommendation Marketplace System
            </p>
            <h1 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              Products
            </h1>
          </div>
          <Button onClick={() => setCreateMenuOpen(true)}>
            <Plus className="h-4 w-4" />
            Create product
          </Button>
        </div>
      </section>

      {recommendedQuery.data && recommendedQuery.data.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">
                Recommended for you
              </h2>
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
                onEdit={setEditingProduct}
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
              onEdit={setEditingProduct}
            />
          ))}
        </div>
      </section>
      <ProductMenu
        open={createMenuOpen}
        isSubmitting={createProductMutation.isPending}
        onClose={() => setCreateMenuOpen(false)}
        onSubmit={handleCreateProduct}
      />
      <ProductMenu
        open={Boolean(editingProduct)}
        product={editingProduct}
        isSubmitting={updateProductMutation.isPending}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
}
