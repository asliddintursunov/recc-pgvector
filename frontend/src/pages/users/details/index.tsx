import { useParams } from "react-router-dom"

export default function UsersDetailPage() {
  const { id } = useParams()
  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-5xl space-y-2">
        <h1 className="text-2xl font-semibold">User Detail</h1>
        <p className="text-sm text-muted-foreground">
          Connect your user {id} detail page component here.
        </p>
      </section>
    </main>
  )
}
