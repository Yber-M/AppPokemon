"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";


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
    success:
      "border-emerald-200/60 bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-300/20 text-emerald-50",
    warning:
      "border-amber-200/60 bg-gradient-to-r from-amber-400/25 via-amber-300/20 to-amber-200/20 text-amber-50",
    error:
      "border-red-200/60 bg-gradient-to-r from-red-500/25 via-red-400/20 to-red-300/20 text-red-50",
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_15px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl ${variantClasses[toast.variant]}`}
            role="status"
            aria-live="polite"
          >
            <span
              className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full"
              style={{
                backgroundColor:
                  toast.variant === "success"
                    ? "#34d399"
                    : toast.variant === "warning"
                    ? "#fbbf24"
                    : "#f87171",
              }}
              aria-hidden
            />
            <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
            <button
              className="ml-2 cursor-pointer rounded-lg px-2 text-xs font-semibold transition hover:bg-white/15 hover:text-white"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <IoMdCloseCircle size={18} />
            </button>
            <div className="absolute inset-x-3 bottom-2 h-[3px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-white/70"
                style={{ animation: "toast-progress 4.2s linear forwards" }}
              />
            </div>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
