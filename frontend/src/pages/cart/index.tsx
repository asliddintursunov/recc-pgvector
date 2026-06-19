import CartActions from "@/components/CartActions"
import ProductImage from "@/components/ProductImage"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROUTES } from "@/constants"
import { useCreatePurchase } from "@/hooks"
import { formatCurrency } from "@/lib"
import { useProductsStore, useProfileStore } from "@/store"
import { Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function CartPage() {
  const { profile } = useProfileStore()
  const {
    cart,
    selectedProductIds,
    toggleSelectedProduct,
    selectAllProducts,
    clearSelectedProducts,
    removeProduct,
    clearCart,
  } = useProductsStore()
  const { mutateAsync: createPurchase, isPending: isCreatePurchasePending } =
    useCreatePurchase()
  const isCustomer = profile?.role === "customer"

  const selectedCartItems = cart.filter((item) =>
    selectedProductIds.includes(item.product.id)
  )
  const isAllSelected =
    cart.length > 0 && selectedProductIds.length === cart.length
  const selectedTotal = selectedCartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      clearSelectedProducts()
      return
    }

    selectAllProducts()
  }

  const handleCheckout = async () => {
    if (selectedCartItems.length === 0) {
      return
    }

    await createPurchase(
      selectedCartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    )
    clearCart()
  }

  if (!isCustomer) {
    return (
      <main className="min-h-svh p-6">
        <section className="mx-auto w-full max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
              <CardDescription>
                Cart checkout is available to customer accounts.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      </main>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-svh p-6">
        <section className="mx-auto w-full max-w-5xl">
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
              <CardDescription>Your cart is empty.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={ROUTES.PRODUCTS.ROOT}>Browse products</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Cart</h1>
            <p className="text-sm text-muted-foreground">
              Select products and submit them as a purchase.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={clearCart}>
              Clear cart
            </Button>
            <Button
              disabled={
                selectedCartItems.length === 0 || isCreatePurchasePending
              }
              onClick={handleCheckout}
            >
              {isCreatePurchasePending
                ? "Submitting..."
                : `Checkout ${formatCurrency(selectedTotal)}`}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      aria-label="Select all cart products"
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                      className="size-4 accent-primary"
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item) => {
                  const isSelected = selectedProductIds.includes(
                    item.product.id
                  )

                  return (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.product.title}`}
                          checked={isSelected}
                          onChange={() =>
                            toggleSelectedProduct(item.product.id)
                          }
                          className="size-4 accent-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-20 shrink-0">
                            <ProductImage product={item.product} />
                          </div>
                          <div className="min-w-0">
                            <Link
                              className="font-medium hover:underline"
                              to={ROUTES.PRODUCTS.DETAIL.replace(
                                ":id",
                                item.product.id
                              )}
                            >
                              {item.product.title}
                            </Link>
                            <p className="line-clamp-1 text-sm text-muted-foreground">
                              {item.product.description ||
                                "No description provided."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.product.price)}
                      </TableCell>
                      <TableCell>
                        <CartActions product={item.product} size="sm" />
                      </TableCell>
                      <TableCell>
                        {formatCurrency(item.product.price * item.quantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Remove ${item.product.title}`}
                          onClick={() => removeProduct(item.product.id)}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
