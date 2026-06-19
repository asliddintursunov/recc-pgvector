import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLoginMutation, useRegisterMutation } from "@/hooks/useSubmit"
import { getDefaultRoute } from "@/lib"
import { useTokenStore, useProfileStore } from "@/store"
import type { AuthMode, AuthRole } from "@/types"
import { type FormEvent, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [role, setRole] = useState<AuthRole>("customer")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const navigate = useNavigate()
  const { accessToken } = useTokenStore()
  const { profile } = useProfileStore()

  if (accessToken && profile) {
    return <Navigate to={getDefaultRoute(profile.role)} replace />
  }

  const isLogin = mode === "login"
  const isSubmitting = loginMutation.isPending || registerMutation.isPending

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode)

    if (nextMode === "register") {
      setRole("customer")
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const credentials = {
      username: username.trim(),
      password,
    }

    if (isLogin) {
      const data = await loginMutation.mutateAsync(credentials)
      navigate(getDefaultRoute(data.profile.role), { replace: true })
      return
    }

    await registerMutation.mutateAsync({ ...credentials, role })
    setMode("login")
    setRole("customer")
    setPassword("")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
              <CardDescription>
                Enter your username and password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={isLogin ? "default" : "outline"}
                        onClick={() => handleModeChange("login")}
                        disabled={isSubmitting}
                      >
                        Login
                      </Button>
                      <Button
                        type="button"
                        variant={!isLogin ? "default" : "outline"}
                        onClick={() => handleModeChange("register")}
                        disabled={isSubmitting}
                      >
                        Register
                      </Button>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="username"
                      disabled={isSubmitting}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      placeholder="********"
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </Field>
                  {!isLogin ? (
                    <Field>
                      <FieldLabel>Role</FieldLabel>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={role === "customer" ? "default" : "outline"}
                          onClick={() => setRole("customer")}
                          disabled={isSubmitting}
                        >
                          Customer
                        </Button>
                        <Button
                          type="button"
                          variant={role === "merchant" ? "default" : "outline"}
                          onClick={() => setRole("merchant")}
                          disabled={isSubmitting}
                        >
                          Merchant
                        </Button>
                      </div>
                    </Field>
                  ) : null}
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Please wait..."
                        : isLogin
                          ? "Login"
                          : "Register"}
                    </Button>
                    {!isLogin ? (
                      <FieldDescription className="text-center">
                        Customer is selected by default.
                      </FieldDescription>
                    ) : null}
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
