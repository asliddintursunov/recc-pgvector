import AccessRestricted from "@/components/AccessRestricted"
import Empty from "@/components/Empty"
import {
  Card,
  CardContent,
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
  const { data: purchases, isLoading: isPurchasesLoading } =
    usePurchases(canViewPurchases)

  if (!canViewPurchases) {
    return (
      <main className="p-6">
        <AccessRestricted
          title="Purchases"
          description="Purchases are available to customer and admin accounts."
        />
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
        {isPurchasesLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <Spinner className="size-6" />
            </CardContent>
          </Card>
        ) : (purchases ?? []).length > 0 ? (
          <Card>
            <CardContent className="pt-6">
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
                  {(purchases ?? []).map((purchase) => (
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
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Empty
            title="No purchases found"
            description="Your completed purchases will appear here."
          />
        )}
      </section>
    </main>
  )
}
