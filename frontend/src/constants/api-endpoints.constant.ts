export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: (role: "customer" | "merchant") => `/auth/register/${role}`,
    },
    PRODUCTS: {
        ALL: "/products",
        CREATE: "/products",
        RECOMMENDED: "/products/recommended",
        DETAIL: (id: string) => `/products/${id}`,
        UPDATE: (id: string) => `/products/${id}`,
        INTERACT: (id: string) => `/products/${id}/interaction`,
    },
    USERS: {
        PROFILE: "/users/profile",
        CUSTOMERS: "/users/customers",
        MERCHANTS: "/users/merchants",
        DETAIL: (id: string) => `/users/${id}`,
    },
    PURCHASES: {
        ALL: "/purchases",
        CREATE: "/purchases",
        DETAIL: (id: string) => `/purchases/${id}`,
    },
};
