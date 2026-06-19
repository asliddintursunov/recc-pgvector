import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants"
import { useUserDetails } from "@/hooks"
import { formatDate } from "@/lib"
import { useProfileStore } from "@/store"
import { Link, useParams } from "react-router-dom"

export default function UsersDetailPage() {
  const { id } = useParams()
  const { profile } = useProfileStore()
  const isAdmin = profile?.role === "admin"
  const userQuery = useUserDetails(id, isAdmin)

  if (!isAdmin) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>User detail</CardTitle>
            <CardDescription>
              Only admin accounts can view user details.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (userQuery.isLoading) {
    return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (!userQuery.data) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>No user exists for ID {id}.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const user = userQuery.data

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <Link
          className="text-sm font-medium text-primary hover:underline"
          to={ROUTES.USERS.ROOT}
        >
          Back to users
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription className="capitalize">
              {user.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="mt-1 font-medium break-all">{user.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
