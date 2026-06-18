import { useParams } from "react-router-dom"

export default function PurchasesDetailPage() {
  const { id } = useParams()
  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-5xl space-y-2">
        <h1 className="text-2xl font-semibold">Purchases Detail</h1>
        <p className="text-sm text-muted-foreground">
          Connect your purchases {id} detail page component here.
        </p>
      </section>
    </main>
  )
}
