import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { useCustomers, useMerchants } from "@/hooks"
import { formatDate } from "@/lib"
import { useProfileStore } from "@/store"
import type { UserProfile } from "@/types"
import { useState } from "react"
import { Link } from "react-router-dom"

type UsersTab = "customers" | "merchants"

function UserTable({ title, users }: { title: string; users: UserProfile[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{users.length} accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    className="text-sm font-medium text-primary hover:underline"
                    to={ROUTES.USERS.DETAIL.replace(":id", user.id)}
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<UsersTab>("customers")
  const { profile } = useProfileStore()
  const isAdmin = profile?.role === "admin"
  const customersQuery = useCustomers(isAdmin)
  const merchantsQuery = useMerchants(isAdmin)

  if (!isAdmin) {
    return (
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Only admin accounts can view user directories.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const isLoading = customersQuery.isLoading || merchantsQuery.isLoading
  const activeUsers =
    activeTab === "customers"
      ? (customersQuery.data ?? [])
      : (merchantsQuery.data ?? [])
  const activeTitle = activeTab === "customers" ? "Customers" : "Merchants"

  return (
    <main className="min-h-svh p-6">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Customer and merchant accounts.
          </p>
        </div>
        <div className="flex w-fit rounded-md border bg-background p-1">
          <Button
            size="sm"
            variant={activeTab === "customers" ? "default" : "ghost"}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </Button>
          <Button
            size="sm"
            variant={activeTab === "merchants" ? "default" : "ghost"}
            onClick={() => setActiveTab("merchants")}
          >
            Merchants
          </Button>
        </div>
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <Spinner className="size-6" />
            </CardContent>
          </Card>
        ) : (
          <UserTable title={activeTitle} users={activeUsers} />
        )}
      </section>
    </main>
  )
}
