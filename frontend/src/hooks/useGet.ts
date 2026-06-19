import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "../lib";
import type { Product, Purchase, UserProfile } from "../types";
import { API_ENDPOINTS } from "../constants/api-endpoints.constant";
import { useProfileStore } from "../store";

export const useProducts = () => {
    return useQuery<Product[], ApiError>({
        queryKey: ["products"],
        queryFn: () => apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.ALL),
        staleTime: 60_000,
    });
};

export const useRecommendedProducts = (enabled = true) => {
    return useQuery<Product[], ApiError>({
        queryKey: ["products", "recommended"],
        queryFn: () => apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.RECOMMENDED),
        enabled,
        staleTime: 30_000,
    });
};

export const useProductDetails = (id: string | undefined, enabled = true) => {
    return useQuery<Product, ApiError>({
        queryKey: ["products", "detail", id],
        queryFn: () => apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id ?? "")),
        enabled: Boolean(id) && enabled,
        staleTime: 60_000,
    });
};

export const useProfile = () => {
    const { setProfile, profile } = useProfileStore();

    return useQuery<UserProfile | null, ApiError>({
        queryKey: ["users", "profile"],
        queryFn: async () => {
            const profile = await apiClient.get<UserProfile | null>(API_ENDPOINTS.USERS.PROFILE);
            setProfile(profile);
            return profile;
        },
        initialData: () => profile,
        staleTime: 60_000,
    });
};

export const useCustomers = (enabled = true) => {
    return useQuery<UserProfile[], ApiError>({
        queryKey: ["users", "customers"],
        queryFn: () => apiClient.get<UserProfile[]>(API_ENDPOINTS.USERS.CUSTOMERS),
        enabled,
        staleTime: 60_000,
    });
};

export const useMerchants = (enabled = true) => {
    return useQuery<UserProfile[], ApiError>({
        queryKey: ["users", "merchants"],
        queryFn: () => apiClient.get<UserProfile[]>(API_ENDPOINTS.USERS.MERCHANTS),
        enabled,
        staleTime: 60_000,
    });
};

export const useUserDetails = (id: string | undefined, enabled = true) => {
    return useQuery<UserProfile | null, ApiError>({
        queryKey: ["users", "detail", id],
        queryFn: () => apiClient.get<UserProfile | null>(API_ENDPOINTS.USERS.DETAIL(id ?? "")),
        enabled: Boolean(id) && enabled,
        staleTime: 60_000,
    });
};

export const usePurchases = (enabled = true) => {
    return useQuery<Purchase[], ApiError>({
        queryKey: ["purchases"],
        queryFn: () => apiClient.get<Purchase[]>(API_ENDPOINTS.PURCHASES.ALL),
        enabled,
        staleTime: 60_000,
    });
};

export const usePurchaseDetails = (id: string | undefined, enabled = true) => {
    return useQuery<Purchase | null, ApiError>({
        queryKey: ["purchases", "detail", id],
        queryFn: () => apiClient.get<Purchase | null>(API_ENDPOINTS.PURCHASES.DETAIL(id ?? "")),
        enabled: Boolean(id) && enabled,
        staleTime: 60_000,
    });
};
