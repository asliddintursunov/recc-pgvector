import { ProductDrawer } from "@/components/product-drawer"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useCreateProduct, useProducts, useUpdateProduct } from "@/hooks"
import { useProfileStore } from "@/store"
import type { CreateProductBody, Product, UpdateProductBody } from "@/types"
import { useState } from "react"

export default function ProductsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data, isLoading } = useProducts()
  const { profile } = useProfileStore()
  const role = profile?.role
  const isMerchant = role === "merchant"
  const { mutateAsync: createProduct, isPending: isCreateProductPending } =
    useCreateProduct()
  const { mutateAsync: updateProduct, isPending: isUpdateProductPending } =
    useUpdateProduct()

  const openCreateDrawer = () => {
    setEditingProduct(null)
    setDrawerOpen(true)
  }

  const openEditDrawer = (product: Product) => {
    setEditingProduct(product)
    setDrawerOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)

    if (!open) {
      setEditingProduct(null)
    }
  }

  const handleProductSubmit = async (
    values: CreateProductBody | UpdateProductBody
  ) => {
    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          body: values,
        })
      } else {
        await createProduct(values as CreateProductBody)
      }

      handleDrawerOpenChange(false)
    } catch {
      return
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6">
        <Spinner className="size-6" />
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-sm text-muted-foreground">
              Browse products and manage merchant catalog items.
            </p>
          </div>
          {isMerchant ? (
            <Button onClick={openCreateDrawer}>Create product</Button>
          ) : null}
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">All products</h2>
            <p className="text-sm text-muted-foreground">
              {isMerchant
                ? "Only your merchant products are shown."
                : "Available product catalog."}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                role={role ?? undefined}
                onEdit={openEditDrawer}
              />
            ))}
          </div>
        </section>
      </section>
      <ProductDrawer
        open={drawerOpen}
        product={editingProduct}
        isSubmitting={isCreateProductPending || isUpdateProductPending}
        onOpenChange={handleDrawerOpenChange}
        onSubmit={handleProductSubmit}
      />
    </main>
  )
}
