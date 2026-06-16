import { Lock, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../../hooks/useSubmit";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import localstorage from "../../lib/local-storage.lib";
import { ROUTES } from "../../constants/route.constant";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  if (localstorage.get("authToken")) {
    return <Navigate to={ROUTES.PRODUCTS} replace />;
  }

  const submitLabel = mode === "login" ? "Sign in" : "Create account";
  const isSubmitting = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const credentials = {
      username: username.trim(),
      password,
    };

    switch (mode) {
      case "login":
        await loginMutation.mutateAsync(credentials);
        navigate(ROUTES.PRODUCTS, { replace: true });
        break;
      case "register":
        await registerMutation.mutateAsync(credentials);
        setMode("login");
        setUsername("");
        setPassword("");
        break;
      default:
        toast.error("Invalid authentication mode.");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-zinc-950">
            Recommendation System
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to browse recommended products.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft">
          <div className="mb-6 grid grid-cols-2 rounded-md bg-zinc-100 p-1">
            <Button
              variant={mode === "login" ? "primary" : "ghost"}
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setMode("login");
              }}
            >
              Sign in
            </Button>
            <Button
              variant={mode === "register" ? "primary" : "ghost"}
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setMode("register");
              }}
            >
              Register
            </Button>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              placeholder="alice"
              disabled={isSubmitting}
              type="text"
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              placeholder="password123"
              disabled={isSubmitting}
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={1}
              required
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? <LoadingSpinner /> : submitLabel}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
