import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useProfile } from "@/hooks"
import { formatDate } from "@/lib"

export default function ProfilePage() {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useProfile()

  if (isProfileLoading) {
    return (
      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6">
        <Spinner className="size-6" />
      </main>
    )
  }

  if (profileError || !profile) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile unavailable</CardTitle>
            <CardDescription>
              Your profile could not be loaded right now.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Account details for the signed-in user.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{profile.username}</CardTitle>
            <CardDescription className="capitalize">
              {profile.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="mt-1 font-medium">
                  {formatDate(profile.createdAt)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
