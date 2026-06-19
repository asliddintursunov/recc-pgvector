import { LOCAL_STORAGE_KEYS } from "@/constants";
import type { UserProfile } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileState {
    profile: UserProfile | null;
    setProfile: (profile: UserProfile | null) => void;
    getProfile: () => UserProfile | null;
    removeProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profile: null,
            setProfile: (profile) => set({ profile }),
            getProfile: () => get().profile,
            removeProfile: () => set({ profile: null }),
        }),
        {
            name: LOCAL_STORAGE_KEYS.PROFILE,
        }
    )
);