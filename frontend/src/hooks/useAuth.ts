import { useMutation } from "@tanstack/react-query";
import { login, register } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import type { ApiError, AuthCredentials, LoginResponse, RegisterResponse } from "../types";

export const useLoginMutation = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const addToast = useToastStore((state) => state.addToast);

  return useMutation<LoginResponse, ApiError, AuthCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      addToast({ title: "Welcome back", description: "You are signed in.", tone: "success" });
    },
    onError: (error) => {
      addToast({ title: "Could not sign in", description: error.message, tone: "error" });
    },
  });
};

export const useRegisterMutation = () => {
  const addToast = useToastStore((state) => state.addToast);

  return useMutation<RegisterResponse, ApiError, AuthCredentials>({
    mutationFn: register,
    onSuccess: (data) => {
      addToast({ title: "Account created", description: data.message, tone: "success" });
    },
    onError: (error) => {
      addToast({ title: "Could not create account", description: error.message, tone: "error" });
    },
  });
};
