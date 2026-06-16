import { ArrowLeft, Heart, Pencil } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useCreateInteraction,
  useProductDetails,
  useUpdateProduct,
} from "../../../hooks";
import { Button } from "../../../components/ui/Button";
import { ROUTES } from "../../../constants/route.constant";
import {
  ProductMenu,
  type ProductMenuValues,
} from "../../../components/ui/ProductMenu";

const tagLabel = (tag: string): string => tag.replace("_", " ");

export default function ProductDetailPage() {
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    error: productError,
    isLoading: productLoading,
  } = useProductDetails(id ?? "");
  const interactionMutation = useCreateInteraction();
  const updateProductMutation = useUpdateProduct();

  if (productLoading) {
    return <LoadingSpinner label="Loading product" />;
  }

  if (productError || !product) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {productError?.message ?? "Product not found."}
      </div>
    );
  }

  const handleLike = () => {
    interactionMutation.mutateAsync({
      productId: product.id,
      actionType: "like",
    });
  };

  const handleUpdateProduct = async (values: ProductMenuValues) => {
    await updateProductMutation.mutateAsync({
      id: product.id,
      body: values,
    });
    setEditMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.PRODUCTS}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex min-h-96 items-end bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500 p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">
                {product.tags[0] ? tagLabel(product.tags[0]) : "marketplace"}
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-5xl">
                {product.title}
              </h1>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-base font-semibold text-zinc-950">
              Description
            </h2>
            <p className="mt-3 leading-7 text-zinc-600">
              {product.description ?? "No description provided."}
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="mt-2 text-sm text-zinc-500">
            Listed {new Date(product.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium capitalize text-zinc-700"
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <Button
              type="button"
              onClick={() => setEditMenuOpen(true)}
              disabled={updateProductMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil className="h-4 w-4" />
              Edit product
            </Button>
            <Button
              type="button"
              onClick={handleLike}
              disabled={interactionMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </aside>
      </section>
      <ProductMenu
        open={editMenuOpen}
        product={product}
        isSubmitting={updateProductMutation.isPending}
        onClose={() => setEditMenuOpen(false)}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
}
