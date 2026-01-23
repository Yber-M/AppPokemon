import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/src/components/ui/Input";
import { MdCleaningServices } from "react-icons/md";

import clsx from "clsx";

type UserFiltersProps = {
  search: string;
  role: "ALL" | "USER" | "ADMIN";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: "ALL" | "USER" | "ADMIN") => void;
  onClearFilters: () => void;
};

export function UserFilters({ search, role, onSearchChange, onRoleChange, onClearFilters }: UserFiltersProps) {
  const options: Array<{ label: string; value: "ALL" | "USER" | "ADMIN" }> = [
    { label: "Todos", value: "ALL" },
    { label: "USER", value: "USER" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  const isCurrent = (v: "ALL" | "USER" | "ADMIN") => v === role;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full lg:max-w-md">
        <Input
          className="text-sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por ID, nombre o email"
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
        <span className="text-xs font-semibold text-slate-300">Filtro por roles:</span>
        <div className="relative mt-1 w-full lg:w-auto" ref={menuRef}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 hover:bg-white/10"
            onClick={() => setOpen((p) => !p)}
          >
            <span>{options.find((o) => o.value === role)?.label ?? "Todos"}</span>
            <span className="text-xs opacity-70">▾</span>
          </button>
          {open && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-white/15 bg-slate-900/90 backdrop-blur shadow-2xl">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  className={clsx(
                    "block w-full px-3 py-2 text-left text-sm text-white transition hover:bg-white/10 cursor-pointer",
                    isCurrent(opt.value) && "bg-white/10 font-semibold"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onRoleChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
          onClick={() => {
            onSearchChange("");
            onRoleChange("ALL");
            onClearFilters();
            setOpen(false);
          }}
        >
          <MdCleaningServices className="text-lg" />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
