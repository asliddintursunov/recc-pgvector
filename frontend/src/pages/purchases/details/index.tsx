import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants"
import { usePurchaseDetails } from "@/hooks"
import { formatCurrency, formatDate, formatTag } from "@/lib"
import { useProfileStore } from "@/store"
import { Link, useParams } from "react-router-dom"

export default function PurchasesDetailPage() {
  const { id } = useParams()
  const { profile } = useProfileStore()
  const role = profile?.role
  const canViewPurchase = role === "admin" || role === "customer"
  const { data: purchase, isLoading: isPurchaseLoading } = usePurchaseDetails(
    id,
    canViewPurchase
  )

  if (!canViewPurchase) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase detail</CardTitle>
            <CardDescription>
              Purchase details are available to customer and admin accounts.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (isPurchaseLoading) {
    return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (!purchase) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase not found</CardTitle>
            <CardDescription>No purchase exists for ID {id}.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <Link
          className="text-sm font-medium text-primary hover:underline"
          to={ROUTES.PURCHASES.ROOT}
        >
          Back to purchases
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{purchase.product.title}</CardTitle>
            <CardDescription>
              Purchased {formatDate(purchase.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Quantity</dt>
                <dd className="mt-1 font-medium">{purchase.quantity}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Unit price</dt>
                <dd className="mt-1 font-medium">
                  {formatCurrency(purchase.product.price)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Description</dt>
                <dd className="mt-1 leading-7">
                  {purchase.product.description || "No description provided."}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Tags</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {purchase.product.tags.length > 0
                    ? purchase.product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize"
                        >
                          {formatTag(tag)}
                        </span>
                      ))
                    : "No tags"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
