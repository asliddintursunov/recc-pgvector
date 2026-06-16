import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../constants/api-endpoint.constant";
import { apiClient } from "../lib";
import type { ApiError, Product } from "../types";

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
