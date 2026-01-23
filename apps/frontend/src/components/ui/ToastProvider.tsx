"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastVariant = "success" | "warning" | "error";

export type ToastOptions = {
  message: string;
  variant?: ToastVariant;
};

type ToastItem = Required<ToastOptions> & { id: number };

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => removeToast(id), 4200);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      showToast,
      success: (message: string) => showToast(message, "success"),
      warning: (message: string) => showToast(message, "warning"),
      error: (message: string) => showToast(message, "error"),
    }),
    [showToast]
  );

  const variantClasses: Record<ToastVariant, string> = {
    success: "border-emerald-300/70 bg-emerald-600 text-white",
    warning: "border-amber-300/70 bg-amber-400 text-slate-900",
    error: "border-red-300/70 bg-red-600 text-white",
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${variantClasses[toast.variant]}`}
            role="status"
            aria-live="polite"
          >
            <span
              className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full"
              style={{
                backgroundColor:
                  toast.variant === "success"
                    ? "#22c55e"
                    : toast.variant === "warning"
                    ? "#f59e0b"
                    : "#f87171",
              }}
              aria-hidden
            />
            <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
            <button
              className="ml-2 rounded-lg px-2 text-xs font-semibold transition hover:bg-white/10"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
