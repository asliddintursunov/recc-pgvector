export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: (role: "customer" | "merchant") => `/auth/register/${role}`,
    },
    PRODUCTS: {
        ALL: "/products",
        RECOMMENDED: "/products/recommended",
        DETAIL: (id: string) => `/products/${id}`,
        UPDATE: (id: string) => `/products/${id}`,
        INTERACT: (id: string) => `/products/${id}/interaction`,
    },
};
