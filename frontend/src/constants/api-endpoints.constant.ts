export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
    },
    PRODUCTS: {
        ALL: "/products",
        RECOMMENDED: "/products/recommended",
        DETAIL: (id: string) => `/products/${id}`,
        UPDATE: (id: string) => `/products/${id}`,
        INTERACT: (id: string) => `/products/${id}/interaction`,
    },
};