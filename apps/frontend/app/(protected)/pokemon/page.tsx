"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/src/guards/withAuth";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchPokemonInitial,
  resetPokemon,
  setLimit,
  appendPokemon,
  setLoadingMore,
} from "@/src/store/slices/pokemon.slice";
import { clearSession } from "@/src/store/slices/auth.slice";
import { Button } from "@/src/components/ui/Button";
import { IoLogOut } from "react-icons/io5";
import { pokemonService } from "@/src/services/pokemon.service";
import { Modal } from "@/src/components/ui/Modal";
import { PokemonDetailResponse } from "@/src/types/pokemon.types";

function getIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque especial",
  "special-defense": "Defensa especial",
  speed: "Velocidad",
};

function formatPokemonValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PokemonPage() {
  useAuthGuard();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailResponse | null>(null);
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

  const handleOpenDetails = useCallback(async (name: string) => {
    setIsModalOpen(true);
    setDetailLoading(true);
    setDetailError(null);

    try {
      const detail = await pokemonService.detail(name);
      setSelectedPokemon(detail);
    } catch (err: any) {
      setSelectedPokemon(null);
      setDetailError(err?.response?.data?.message ?? "No se pudieron cargar los detalles del pokémon.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsModalOpen(false);
    setDetailError(null);
  }, []);

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
  }, [dispatch, limit]);

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
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(p.name)}
                      className="text-sm text-sky-300 hover:text-sky-200 hover:underline cursor-pointer"
                    >
                      Ver estadísticas
                    </button>
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

      <Modal
        open={isModalOpen}
        title={selectedPokemon ? `#${selectedPokemon.id} ${formatPokemonValue(selectedPokemon.name)}` : "Estadísticas del Pokémon"}
        onClose={handleCloseDetails}
      >
        {detailLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            Cargando estadísticas...
          </div>
        )}

        {!detailLoading && detailError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {detailError}
          </div>
        )}

        {!detailLoading && !detailError && selectedPokemon && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`}
                alt={selectedPokemon.name}
                className="h-20 w-20 rounded-xl bg-slate-100 p-2"
              />
              <div>
                <div className="text-sm text-slate-600">
                  Altura: {(selectedPokemon.height / 10).toFixed(1)} m
                </div>
                <div className="text-sm text-slate-600">
                  Peso: {(selectedPokemon.weight / 10).toFixed(1)} kg
                </div>
                <div className="text-sm text-slate-600">
                  Experiencia base: {selectedPokemon.base_experience}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tipos</div>
              <div className="flex flex-wrap gap-2">
                {selectedPokemon.types.map((item) => (
                  <span
                    key={item.type.name}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {formatPokemonValue(item.type.name)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Habilidades
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPokemon.abilities.map((item) => (
                  <span
                    key={item.ability.name}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {formatPokemonValue(item.ability.name)}
                    {item.is_hidden ? " (oculta)" : ""}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Estadísticas base
              </div>
              <div className="space-y-2">
                {selectedPokemon.stats.map((item) => {
                  const percentage = Math.min(100, Math.round((item.base_stat / 200) * 100));
                  return (
                    <div key={item.stat.name}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                        <span>{STAT_LABELS[item.stat.name] ?? formatPokemonValue(item.stat.name)}</span>
                        <span className="font-semibold">{item.base_stat}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
