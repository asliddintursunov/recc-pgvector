import { LOCAL_STORAGE_KEYS } from "@/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TokenState = {
    accessToken: string | null;
    setToken: (auth: { accessToken: string }) => void;
    removeToken: () => void;
};


export const useTokenStore = create<TokenState>()(
    persist(
        (set) => ({
            accessToken: null,
            setToken: ({ accessToken }) => set({ accessToken }),
            removeToken: () => set({ accessToken: null }),
        }),
        {
            name: LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
            storage: createJSONStorage(() => localStorage),
        },
    ),
);