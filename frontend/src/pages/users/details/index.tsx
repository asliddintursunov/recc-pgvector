import AccessRestricted from "@/components/AccessRestricted"
import Empty from "@/components/Empty"
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
        <AccessRestricted
          title="User detail"
          description="Only admin accounts can view user details."
        />
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
        <Empty
          title="User not found"
          description={`No user exists for ID ${id}.`}
        />
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
