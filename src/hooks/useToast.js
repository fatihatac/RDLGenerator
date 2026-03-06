import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Toast Store — Zustand ile global bildirim sistemi
// ---------------------------------------------------------------------------
const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = 'info', message, duration = 3500 }) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// ---------------------------------------------------------------------------
// useToast — bileşenlerden kullanım için
// ---------------------------------------------------------------------------
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message, duration)  => addToast({ type: 'success', message, duration }),
    error:   (message, duration)  => addToast({ type: 'error',   message, duration: duration ?? 5000 }),
    warning: (message, duration)  => addToast({ type: 'warning', message, duration }),
    info:    (message, duration)  => addToast({ type: 'info',    message, duration }),
  };
}

export { useToastStore };
