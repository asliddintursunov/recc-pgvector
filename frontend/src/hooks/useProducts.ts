import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  createProductInteraction,
  getProduct,
  getProducts,
  getRecommendedProducts,
  updateProduct,
} from "../lib/api";
import { useToastStore } from "../stores/toastStore";
import type {
  ApiError,
  CreateProductBody,
  InteractionType,
  Product,
  UpdateProductBody,
} from "../types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: () => [...productKeys.lists(), "all"] as const,
  recommended: () => [...productKeys.lists(), "recommended"] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProductsQuery = () =>
  useQuery<Product[], ApiError>({
    queryKey: productKeys.list(),
    queryFn: getProducts,
    staleTime: 60_000,
  });

export const useRecommendedProductsQuery = () =>
  useQuery<Product[], ApiError>({
    queryKey: productKeys.recommended(),
    queryFn: getRecommendedProducts,
    staleTime: 30_000,
  });

export const useProductQuery = (productId: string | undefined) =>
  useQuery<Product, ApiError>({
    queryKey: productKeys.detail(productId ?? "missing"),
    queryFn: () => getProduct(productId ?? ""),
    enabled: Boolean(productId),
    staleTime: 60_000,
  });

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation<Product, ApiError, CreateProductBody>({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      addToast({ title: "Product created", tone: "success" });
    },
    onError: (error) => {
      addToast({ title: "Product was not created", description: error.message, tone: "error" });
    },
  });
};

interface UpdateProductVariables {
  id: string;
  body: UpdateProductBody;
}

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation<Product, ApiError, UpdateProductVariables>({
    mutationFn: ({ id, body }) => updateProduct(id, body),
    onSuccess: async (product) => {
      await queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: productKeys.detail(product.id) });
      addToast({ title: "Product updated", tone: "success" });
    },
    onError: (error) => {
      addToast({ title: "Product was not updated", description: error.message, tone: "error" });
    },
  });
};

interface InteractionVariables {
  productId: string;
  actionType: InteractionType;
}

export const useCreateInteractionMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation<boolean, ApiError, InteractionVariables>({
    mutationFn: ({ productId, actionType }) =>
      createProductInteraction(productId, { actionType }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: productKeys.recommended() });

      if (variables.actionType === "like") {
        addToast({
          title: "Preference saved",
          description: "Recommendations will adjust from your likes.",
          tone: "success",
        });
      }
    },
    onError: (error) => {
      addToast({ title: "Interaction was not saved", description: error.message, tone: "error" });
    },
  });
};
