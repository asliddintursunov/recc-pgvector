import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import type {
  ApiError,
  AuthCredentials,
  CreateInteractionBody,
  CreateProductBody,
  LoginResponse,
  Product,
  RegisterResponse,
  UpdateProductBody,
} from "../types";

interface BackendErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    const rawMessage = data?.message;
    const details = Array.isArray(rawMessage) ? rawMessage : undefined;
    const message =
      details?.join(", ") ??
      (typeof rawMessage === "string" ? rawMessage : undefined) ??
      data?.error ??
      error.message;

    return {
      message,
      status,
      details,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please try again." };
};

export const getApiErrorMessage = (error: unknown): string => normalizeApiError(error).message;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().clearAccessToken();

      if (window.location.pathname !== "/auth") {
        window.location.assign("/auth?session=expired");
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export const register = async (body: AuthCredentials): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("/auth/register", body);
  return data;
};

export const login = async (body: AuthCredentials): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", body);
  return data;
};

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/products");
  return data;
};

export const getRecommendedProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/products/recommended");
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export const createProduct = async (body: CreateProductBody): Promise<Product> => {
  const { data } = await api.post<Product>("/products", body);
  return data;
};

export const updateProduct = async (id: string, body: UpdateProductBody): Promise<Product> => {
  const { data } = await api.patch<Product>(`/products/${id}`, body);
  return data;
};

export const createProductInteraction = async (
  id: string,
  body: CreateInteractionBody,
): Promise<boolean> => {
  const { data } = await api.post<boolean>(`/products/${id}/interaction`, body);
  return data;
};
