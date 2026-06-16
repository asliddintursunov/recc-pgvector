import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ApiError, AuthCredentials, InteractionType } from "../types";
import { apiClient } from "../lib";
import { API_ENDPOINTS } from "../constants/api-endpoint.constant";
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
    return useMutation<{ message: string }, ApiError, AuthCredentials>({
        mutationFn: (credentials) =>
            apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.REGISTER, credentials, {
                skipAuth: true,
            }),
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
}

export const useCreateProduct = () => { };
export const useUpdateProduct = () => { };

export const useCreateInteraction = () => {
    return useMutation<void, ApiError, { productId: string; actionType: InteractionType }>({
        mutationFn: ({ productId, actionType }) =>
            apiClient.post(API_ENDPOINTS.PRODUCTS.INTERACT(productId), { actionType }),
        onError: (error) => {
            toast.error(error.data.message);
        }
    })
};