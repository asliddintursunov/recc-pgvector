import { ProductDrawer } from "@/components/product-drawer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants"
import {
  useCreateInteraction,
  useCreateProduct,
  useCreatePurchase,
  useProducts,
  useRecommendedProducts,
  useUpdateProduct,
} from "@/hooks"
import { formatCurrency, formatDate, formatTag } from "@/lib"
import { useProfileStore } from "@/store"
import type {
  CreateProductBody,
  Product,
  UpdateProductBody,
  UserRole,
} from "@/types"
import { useState } from "react"
import { Link } from "react-router-dom"

type ProductCardProps = {
  product: Product
  role?: UserRole
  isActionPending?: boolean
  onBuy: (product: Product) => void
  onEdit: (product: Product) => void
  onLike: (product: Product) => void
}

function productPath(id: string) {
  return ROUTES.PRODUCTS.DETAIL.replace(":id", id)
}

function ProductImage({ product }: { product: Product }) {
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

function ProductCard({
  product,
  role,
  isActionPending,
  onBuy,
  onEdit,
  onLike,
}: ProductCardProps) {
  const isCustomer = role === "customer"
  const isMerchant = role === "merchant"

  return (
    <Card className="h-full">
      <CardHeader>
        <ProductImage product={product} />
        <div className="space-y-1">
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>
            Added {formatDate(product.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="min-h-12 text-sm leading-6 text-muted-foreground">
          {product.description || "No description provided."}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
            >
              {formatTag(tag)}
            </span>
          ))}
          {product.tags.length === 0 ? (
            <span className="text-xs text-muted-foreground">No tags</span>
          ) : null}
        </div>
        <div className="text-lg font-semibold">
          {formatCurrency(product.price)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to={productPath(product.id)}>Details</Link>
        </Button>
        {isCustomer ? (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={isActionPending}
              onClick={() => onLike(product)}
            >
              Like
            </Button>
            <Button
              size="sm"
              disabled={isActionPending}
              onClick={() => onBuy(product)}
            >
              Buy
            </Button>
          </>
        ) : null}
        {isMerchant ? (
          <Button size="sm" onClick={() => onEdit(product)}>
            Edit
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}

function ProductGrid({
  products,
  role,
  isActionPending,
  onBuy,
  onEdit,
  onLike,
}: {
  products: Product[]
  role?: UserRole
  isActionPending?: boolean
  onBuy: (product: Product) => void
  onEdit: (product: Product) => void
  onLike: (product: Product) => void
}) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No products found.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          role={role ?? undefined}
          isActionPending={isActionPending}
          onBuy={onBuy}
          onEdit={onEdit}
          onLike={onLike}
        />
      ))}
    </div>
  )
}

export default function ProductsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const productsQuery = useProducts()
  const { profile } = useProfileStore()
  const role = profile?.role
  const isCustomer = role === "customer"
  const isMerchant = role === "merchant"
  const recommendedQuery = useRecommendedProducts(isCustomer)
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const createInteractionMutation = useCreateInteraction()
  const createPurchaseMutation = useCreatePurchase()

  const isDrawerSubmitting =
    createProductMutation.isPending || updateProductMutation.isPending
  const isActionPending =
    createInteractionMutation.isPending || createPurchaseMutation.isPending

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
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          body: values,
        })
      } else {
        await createProductMutation.mutateAsync(values as CreateProductBody)
      }

      handleDrawerOpenChange(false)
    } catch {
      return
    }
  }

  const handleLike = (product: Product) => {
    createInteractionMutation.mutate({
      productId: product.id,
      actionType: "like",
    })
  }

  const handleBuy = (product: Product) => {
    createPurchaseMutation.mutate([
      {
        productId: product.id,
        quantity: 1,
      },
    ])
  }

  if (productsQuery.isLoading) {
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

        {isCustomer ? (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Recommended</h2>
              <p className="text-sm text-muted-foreground">
                Products suggested from your interactions.
              </p>
            </div>
            {recommendedQuery.isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-10">
                  <Spinner className="size-6" />
                </CardContent>
              </Card>
            ) : (
              <ProductGrid
                products={recommendedQuery.data ?? []}
                role={role ?? undefined}
                isActionPending={isActionPending}
                onBuy={handleBuy}
                onEdit={openEditDrawer}
                onLike={handleLike}
              />
            )}
          </section>
        ) : null}

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">All products</h2>
            <p className="text-sm text-muted-foreground">
              {isMerchant
                ? "Only your merchant products are shown."
                : "Available product catalog."}
            </p>
          </div>
          <ProductGrid
            products={productsQuery.data ?? []}
            role={role ?? undefined}
            isActionPending={isActionPending}
            onBuy={handleBuy}
            onEdit={openEditDrawer}
            onLike={handleLike}
          />
        </section>
      </section>
      <ProductDrawer
        open={drawerOpen}
        product={editingProduct}
        isSubmitting={isDrawerSubmitting}
        onOpenChange={handleDrawerOpenChange}
        onSubmit={handleProductSubmit}
      />
    </main>
  )
}
