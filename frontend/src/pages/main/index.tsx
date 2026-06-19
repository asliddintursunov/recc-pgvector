import ProductCard from "@/components/ProductCard"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useRecommendedProducts } from "@/hooks"
import { useProfileStore } from "@/store"

export default function MainPage() {
  const { profile } = useProfileStore()
  const isCustomer = profile?.role === "customer"
  const { data, isLoading } = useRecommendedProducts(isCustomer)

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">Main</h1>
          <p className="text-sm text-muted-foreground">
            Recommended products and your latest activity.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Recommended products</h2>
            <p className="text-sm text-muted-foreground">
              Products suggested from your interactions.
            </p>
          </div>

          {!isCustomer ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Recommended products are available to customer accounts.
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-10">
                <Spinner className="size-6" />
              </CardContent>
            </Card>
          ) : (data ?? []).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  role={profile?.role}
                  onEdit={() => undefined}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No recommended products found.
              </CardContent>
            </Card>
          )}
        </section>
      </section>
    </main>
  )
}
