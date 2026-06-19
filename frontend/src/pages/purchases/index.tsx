import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROUTES } from "@/constants"
import { usePurchases } from "@/hooks"
import { formatCurrency, formatDate, formatTag } from "@/lib"
import { useProfileStore } from "@/store"
import { Link } from "react-router-dom"

export default function PurchasesPage() {
  const { profile } = useProfileStore()
  const role = profile?.role
  const canViewPurchases = role === "admin" || role === "customer"
  const purchasesQuery = usePurchases(canViewPurchases)

  if (!canViewPurchases) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchases</CardTitle>
            <CardDescription>
              Purchases are available to customer and admin accounts.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Purchases</h1>
          <p className="text-sm text-muted-foreground">
            Purchase history and product quantities.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            {purchasesQuery.isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Spinner className="size-6" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(purchasesQuery.data ?? []).map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">
                        {purchase.product.title}
                      </TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(purchase.product.price)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {purchase.product.tags.map(formatTag).join(", ") ||
                          "No tags"}
                      </TableCell>
                      <TableCell>{formatDate(purchase.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          className="text-sm font-medium text-primary hover:underline"
                          to={ROUTES.PURCHASES.DETAIL.replace(
                            ":id",
                            purchase.id
                          )}
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(purchasesQuery.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No purchases found.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
