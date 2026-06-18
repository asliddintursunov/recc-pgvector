import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "../lib";
import type { Product, Purchase, UserProfile } from "../types";
import { API_ENDPOINTS } from "../constants/api-endpoints.constant";

export const useProducts = () => {
    return useQuery<Product[], ApiError>({
        queryKey: ["products"],
        queryFn: () => apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.ALL),
        staleTime: 60_000,
    });
};

export const useRecommendedProducts = () => {
    return useQuery<Product[], ApiError>({
        queryKey: ["products", "recommended"],
        queryFn: () => apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.RECOMMENDED),
        staleTime: 30_000,
    });
};

export const useProductDetails = (id: string | undefined) => {
    return useQuery<Product, ApiError>({
        queryKey: ["products", "detail", id],
        queryFn: () => apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id ?? "")),
        enabled: Boolean(id),
        staleTime: 60_000,
    });
};

export const useProfile = () => {
    return useQuery<UserProfile | null, ApiError>({
        queryKey: ["users", "profile"],
        queryFn: () => apiClient.get<UserProfile | null>(API_ENDPOINTS.USERS.PROFILE),
        staleTime: 60_000,
    });
};

export const useCustomers = () => {
    return useQuery<UserProfile[], ApiError>({
        queryKey: ["users", "customers"],
        queryFn: () => apiClient.get<UserProfile[]>(API_ENDPOINTS.USERS.CUSTOMERS),
        staleTime: 60_000,
    });
};

export const useMerchants = () => {
    return useQuery<UserProfile[], ApiError>({
        queryKey: ["users", "merchants"],
        queryFn: () => apiClient.get<UserProfile[]>(API_ENDPOINTS.USERS.MERCHANTS),
        staleTime: 60_000,
    });
};

export const useUserDetails = (id: string | undefined) => {
    return useQuery<UserProfile | null, ApiError>({
        queryKey: ["users", "detail", id],
        queryFn: () => apiClient.get<UserProfile | null>(API_ENDPOINTS.USERS.DETAIL(id ?? "")),
        enabled: Boolean(id),
        staleTime: 60_000,
    });
};

export const usePurchases = () => {
    return useQuery<Purchase[], ApiError>({
        queryKey: ["purchases"],
        queryFn: () => apiClient.get<Purchase[]>(API_ENDPOINTS.PURCHASES.ALL),
        staleTime: 60_000,
    });
};

export const usePurchaseDetails = (id: string | undefined) => {
    return useQuery<Purchase | null, ApiError>({
        queryKey: ["purchases", "detail", id],
        queryFn: () => apiClient.get<Purchase | null>(API_ENDPOINTS.PURCHASES.DETAIL(id ?? "")),
        enabled: Boolean(id),
        staleTime: 60_000,
    });
};
