import React from "react";
import clsx from "clsx";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ open, title, children, onClose, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div
        className={clsx(
          "w-full max-w-lg rounded-2xl border border-white/10 bg-white p-6 shadow-2xl",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="mt-4 space-y-4 text-slate-900">{children}</div>
      </div>
    </div>
  );
}
