import React from "react";

export function AuthHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="mb-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-lg backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
        <img src="/iconPokemon.webp" alt="App Pokemon Logo" className="h-9 w-9 rounded-full" />
      </div>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-[0.18em] text-white/70">App Pokemon</p>
        <p className="text-sm text-white/90">{subtitle}</p>
      </div>
    </div>
  );
}
