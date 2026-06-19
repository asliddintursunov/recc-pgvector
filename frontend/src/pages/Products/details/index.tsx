import { ProductDrawer } from "@/components/product-drawer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants"
import {
  useCreateInteraction,
  useCreatePurchase,
  useProductDetails,
  useUpdateProduct,
} from "@/hooks"
import { formatCurrency, formatDate, formatTag } from "@/lib"
import { useProfileStore } from "@/store"
import type { Product, UpdateProductBody } from "@/types"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { profile } = useProfileStore()
  const role = profile?.role
  const productQuery = useProductDetails(id)
  const updateProductMutation = useUpdateProduct()
  const createInteractionMutation = useCreateInteraction()
  const createPurchaseMutation = useCreatePurchase()
  const isCustomer = role === "customer"
  const isMerchant = role === "merchant"
  const product = productQuery.data

  const handleUpdateProduct = async (values: UpdateProductBody) => {
    if (!product) {
      return
    }

    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        body: values,
      })
      setDrawerOpen(false)
    } catch {
      return
    }
  }

  const handleLike = (currentProduct: Product) => {
    createInteractionMutation.mutate({
      productId: currentProduct.id,
      actionType: "like",
    })
  }

  const handleBuy = (currentProduct: Product) => {
    createPurchaseMutation.mutate([
      {
        productId: currentProduct.id,
        quantity: 1,
      },
    ])
  }

  if (productQuery.isLoading) {
    return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Product not found</CardTitle>
            <CardDescription>No product exists for ID {id}.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const isActionPending =
    createInteractionMutation.isPending || createPurchaseMutation.isPending

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <Link
          className="text-sm font-medium text-primary hover:underline"
          to={ROUTES.PRODUCTS.ROOT}
        >
          Back to products
        </Link>
        <div className="grid gap-6 pt-2 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="px-6 text-center font-medium text-muted-foreground">
                    {product.title}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{product.title}</CardTitle>
                <CardDescription>
                  Added {formatDate(product.createdAt)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-sm font-medium">Description</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {product.description || "No description provided."}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium">Tags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.tags.length > 0
                    ? product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
                        >
                          {formatTag(tag)}
                        </span>
                      ))
                    : "No tags"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{formatCurrency(product.price)}</CardTitle>
              <CardDescription>Product actions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {isCustomer ? (
                <>
                  <Button
                    disabled={isActionPending}
                    onClick={() => handleBuy(product)}
                  >
                    Buy product
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isActionPending}
                    onClick={() => handleLike(product)}
                  >
                    Like product
                  </Button>
                </>
              ) : null}
              {isMerchant ? (
                <Button onClick={() => setDrawerOpen(true)}>
                  Edit product
                </Button>
              ) : null}
              {!isCustomer && !isMerchant ? (
                <p className="text-sm text-muted-foreground">
                  Admin accounts can view product details.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
      <ProductDrawer
        open={drawerOpen}
        product={product}
        isSubmitting={updateProductMutation.isPending}
        onOpenChange={setDrawerOpen}
        onSubmit={handleUpdateProduct}
      />
    </main>
  )
}
