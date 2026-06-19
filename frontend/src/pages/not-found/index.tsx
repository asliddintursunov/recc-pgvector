import Empty from "@/components/Empty"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-sm">
        <Empty
          title="Page not found"
          description="The page you requested does not exist."
        />
      </section>
    </main>
  )
}
