import React from "react";
import clsx from "clsx";

type AlertProps = {
  variant?: "error" | "success";
  children: React.ReactNode;
};

export function Alert({ variant = "error", children }: AlertProps) {
  const styles =
    variant === "error"
      ? "border border-red-500/40 bg-red-500/10 text-red-100"
      : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-100";

  return (
    <div className={clsx("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm", styles)}>
      <span
        className={clsx(
          "h-2 w-2 rounded-full",
          variant === "error" ? "bg-red-400" : "bg-emerald-300"
        )}
        aria-hidden
      />
      <p>{children}</p>
    </div>
  );
}
