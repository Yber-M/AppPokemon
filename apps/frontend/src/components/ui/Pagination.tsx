import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { Button } from "@/src/components/ui/Button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export function Pagination({ page, totalPages, onPrev, onNext, className }: PaginationProps) {
  return (
    <div className={`flex items-center gap-2 text-xs text-slate-200 ${className ?? ""}`}>
      <Button
        variant="ghost"
        className="h-9 rounded-xl border border-white/20 px-3 py-2 text-xs"
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        <IoIosArrowBack />
        Anterior
      </Button>
      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="ghost"
        className="h-9 rounded-xl border border-white/20 px-3 py-2 text-xs"
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Página siguiente"
      >
        Siguiente
        <MdOutlineNavigateNext />
      </Button>
    </div>
  );
}
