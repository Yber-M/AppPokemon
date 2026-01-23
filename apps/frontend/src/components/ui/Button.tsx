import React from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<Variant, string> = {
    primary:
      "cursor-pointer bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-900 shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-emerald-300",
    ghost: "cursor-pointer border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
    outline: "cursor-pointer border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger:
      "cursort-pointer border border-red-300/50 text-red-100 hover:border-red-200 hover:bg-red-500/10 bg-white/5",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
