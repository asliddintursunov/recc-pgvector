import { Lock, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../lib/api";
import { useLoginMutation, useRegisterMutation } from "../hooks/useAuth";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";

type AuthMode = "login" | "register";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inlineError, setInlineError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const addToast = useToastStore((state) => state.addToast);
  const location = useLocation();
  const navigate = useNavigate();
  const sessionExpired = new URLSearchParams(location.search).get("session") === "expired";

  useEffect(() => {
    if (sessionExpired) {
      addToast({
        title: "Session expired",
        description: "Please sign in again to continue.",
        tone: "error",
      });
    }
  }, [addToast, sessionExpired]);

  if (accessToken) {
    return <Navigate to="/products" replace />;
  }

  const submitLabel = mode === "login" ? "Sign in" : "Create account";
  const isSubmitting = loginMutation.isPending || registerMutation.isPending;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInlineError(null);

    const credentials = {
      username: username.trim(),
      password,
    };

    try {
      if (mode === "register") {
        await registerMutation.mutateAsync(credentials);
      }

      await loginMutation.mutateAsync(credentials);
      navigate("/products", { replace: true });
    } catch (error) {
      setInlineError(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-zinc-950">RecoMart</h1>
          <p className="mt-2 text-sm text-zinc-500">Sign in to browse recommended products.</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-soft">
          <div className="mb-6 grid grid-cols-2 rounded-md bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setInlineError(null);
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                mode === "login" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setInlineError(null);
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                mode === "register" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"
              }`}
            >
              Register
            </button>
          </div>
          {inlineError ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {inlineError}
            </div>
          ) : null}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Username</span>
              <span className="mt-1 flex items-center rounded-md border border-zinc-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <User className="h-4 w-4 text-zinc-400" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full border-0 bg-transparent px-3 py-3 text-sm text-zinc-950 outline-none"
                  placeholder="alice"
                  autoComplete="username"
                  required
                />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Password</span>
              <span className="mt-1 flex items-center rounded-md border border-zinc-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <Lock className="h-4 w-4 text-zinc-400" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full border-0 bg-transparent px-3 py-3 text-sm text-zinc-950 outline-none"
                  placeholder="password123"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={1}
                  required
                />
              </span>
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : submitLabel}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
