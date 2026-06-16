import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">, durationMs?: number) => void;
  removeToast: (id: string) => void;
}

const createToastId = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  addToast: (toast, durationMs = 4200) => {
    const id = createToastId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    globalThis.setTimeout(() => get().removeToast(id), durationMs);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
