"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/src/guards/withAuth";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchPokemonInitial,
  fetchPokemonMore,
  resetPokemon,
  setLimit,
  appendPokemon,
  setLoadingMore,
} from "@/src/store/slices/pokemon.slice";
import { clearSession } from "@/src/store/slices/auth.slice";
import { Button } from "@/src/components/ui/Button";
import { IoLogOut } from "react-icons/io5";
import { pokemonService } from "@/src/services/pokemon.service";

function getIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export default function PokemonPage() {
  useAuthGuard();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, loading, loadingMore, error, hasMore, limit, count } =
    useAppSelector((s) => s.pokemon);

  useEffect(() => {
    dispatch(fetchPokemonInitial());
    return () => {
      dispatch(resetPokemon());
    };
  }, [dispatch]);

  const totalLoadedLabel = useMemo(() => {
    if (count) return `${items.length} / ${count}`;
    return `${items.length}`;
  }, [items.length, count]);

  const onLogout = () => {
    dispatch(clearSession());
    router.replace("/login");
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    console.debug("load more clicked", { loaded: items.length, limit });
    try {
      dispatch(setLoadingMore(true));
      const res = await pokemonService.list(limit, items.length);
      dispatch(appendPokemon(res));
    } catch (err) {
      console.error("No se pudo cargar más pokémon", err);
      dispatch(setLoadingMore(false));
    }
  }, [dispatch, loadingMore, items.length, limit]);

  const header = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-300">Explora</p>
          <h1 className="text-3xl font-semibold text-white">Pokémon</h1>
          <p className="text-sm text-slate-400">
            Listado incremental desde PokeAPI (vía proxy).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-200 shadow-sm">
            <span className="text-sm text-slate-300">Mostrar por página</span>
            <select
              value={limit}
              onChange={(e) => {
                dispatch(setLimit(e.target.value));
                dispatch(fetchPokemonInitial());
              }}
              className="rounded-lg border border-white/15 bg-slate-900 px-3 py-1 text-sm text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-white hover:text-red-500 bg-[#ff010146] hover:bg-slate-50 cursor-pointer"
            onClick={onLogout}
          >
            <IoLogOut className="inline-block ml-1 text-2xl" />
          </button>
        </div>
      </div>
    );
  }, [router, dispatch, limit]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {header}

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200 border border-red-500/40">
            {String(error)}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const id = getIdFromUrl(p.url);
            const img = id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
              : "";

            return (
              <div
                key={p.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/40 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.name} className="h-12 w-12" />
                    ) : (
                      <span className="text-xs text-slate-400">N/A</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">#{id || "?"}</div>
                    <div className="truncate text-lg font-semibold capitalize text-white">
                      {p.name}
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sky-300 hover:text-sky-200 hover:underline"
                    >
                      Ver en PokeAPI
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && items.length === 0 && !error && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-200">
              No hay resultados.
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {loading && items.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-800 border-t-white" />
              Cargando...
            </div>
          ) : (
            <div className="text-sm text-slate-400">
              Mostrando {totalLoadedLabel}
            </div>
          )}

          {hasMore && (
            <Button
              variant="primary"
              disabled={loadingMore}
              onClick={handleLoadMore}
              type="button"
              className="mt-2 min-w-[160px]"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-white" />
                  Cargando más...
                </span>
              ) : (
                "Cargar más pokemones"
              )}
            </Button>
          )}

          {!hasMore && (
            <div className="text-sm text-slate-500">No hay más resultados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
