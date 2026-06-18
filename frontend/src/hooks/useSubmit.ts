import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type {
    ApiError,
    AuthCredentials,
    CreatePurchaseBody,
    CreatePurchaseResponse,
    CreateProductBody,
    InteractionType,
    Product,
    RegisterCredentials,
    UpdateProductBody,
} from "../types";
import { apiClient } from "../lib";
import { API_ENDPOINTS } from "../constants";
import localstorage from "../lib/local-storage.lib";

export const useLoginMutation = () => {
    return useMutation<{ accessToken: string }, ApiError, AuthCredentials>({
        mutationFn: (credentials) =>
            apiClient.post<{ accessToken: string }>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
                skipAuth: true,
            }),
        onSuccess: (data) => {
            localstorage.set("authToken", data.accessToken);
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
}

export const useRegisterMutation = () => {
    return useMutation<{ message: string }, ApiError, RegisterCredentials>({
        mutationFn: (credentials) =>
            apiClient.post<{ message: string }>(
                API_ENDPOINTS.AUTH.REGISTER(credentials.role),
                {
                    username: credentials.username,
                    password: credentials.password,
                },
                {
                    skipAuth: true,
                },
            ),
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<Product, ApiError, CreateProductBody>({
        mutationFn: (body) => apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created");
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation<Product, ApiError, { id: string; body: UpdateProductBody }>({
        mutationFn: ({ id, body }) =>
            apiClient.patch<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), body),
        onSuccess: async (product) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["products"] }),
                queryClient.invalidateQueries({ queryKey: ["products", "detail", product.id] }),
            ]);
            toast.success("Product updated");
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
};

export const useCreateInteraction = () => {
    const queryClient = useQueryClient();

    return useMutation<boolean, ApiError, { productId: string; actionType: InteractionType }>({
        mutationFn: ({ productId, actionType }) =>
            apiClient.post<boolean>(API_ENDPOINTS.PRODUCTS.INTERACT(productId), { actionType }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products", "recommended"] });
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
};

export const useCreatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation<CreatePurchaseResponse, ApiError, CreatePurchaseBody[]>({
        mutationFn: (body) =>
            apiClient.post<CreatePurchaseResponse>(API_ENDPOINTS.PURCHASES.CREATE, body),
        onSuccess: async (data) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["purchases"] }),
                queryClient.invalidateQueries({ queryKey: ["products"] }),
                queryClient.invalidateQueries({ queryKey: ["products", "recommended"] }),
            ]);
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
};
