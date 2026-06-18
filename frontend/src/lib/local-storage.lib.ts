import type { UserRole } from "@/types";

const STORAGE_KEYS = {
    authToken: 'auth_token',
    authRole: 'auth_role',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

type StorageValueMap = {
    authToken: string;
    authRole: UserRole;
    theme: 'light' | 'dark';
};

const localstorage = {
    set<K extends StorageKey>(key: K, value: StorageValueMap[K]): void {
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    },

    get<K extends StorageKey>(key: K): StorageValueMap[K] | null {
        const item = localStorage.getItem(STORAGE_KEYS[key]);
        return item ? (JSON.parse(item) as StorageValueMap[K]) : null;
    },

    remove(key: StorageKey): void {
        localStorage.removeItem(STORAGE_KEYS[key]);
    },

    clear(): void {
        localStorage.clear();
    },
};

export default localstorage;
