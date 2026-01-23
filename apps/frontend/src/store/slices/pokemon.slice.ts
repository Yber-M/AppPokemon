import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PokemonListItem, PokemonListResponse } from "@/src/types/pokemon.types";
import { pokemonService } from "@/src/services/pokemon.service";

export type PokemonState = {
  items: PokemonListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  limit: number;
  offset: number;
  hasMore: boolean;
  count: number;
  next: string | null;
  previous: string | null;
};

const initialState: PokemonState = {
  items: [],
  loading: false,
  loadingMore: false,
  error: null,
  // batch size for each fetch; aligns with PokeAPI default page size (20)
  limit: 20,
  offset: 0,
  hasMore: true,
  count: 0,
  next: null,
  previous: null,
};

function getOffsetFromUrl(url?: string | null, fallback = 0) {
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    const offsetParam = parsed.searchParams.get("offset");
    const asNumber = offsetParam ? Number(offsetParam) : NaN;
    return Number.isFinite(asNumber) ? asNumber : fallback;
  } catch (e) {
    return fallback;
  }
}

export const fetchPokemonInitial = createAsyncThunk("pokemon/fetchInitial", async (_, { getState }) => {
  const state = getState() as { pokemon?: PokemonState };
  const limit = state.pokemon?.limit ?? initialState.limit;
  const res = await pokemonService.list(limit, 0);
  return res;
});

export const fetchPokemonMore = createAsyncThunk("pokemon/fetchMore", async (_, { getState }) => {
  const state = getState() as { pokemon?: PokemonState };
  const { limit, items, count, loadingMore } = state.pokemon ?? initialState;

  if (loadingMore) {
    return null as any;
  }

  const currentOffset = items?.length ?? 0;
  const res = await pokemonService.list(limit, currentOffset);
  return res;
});

function mergeUnique(prev: PokemonListItem[], next: PokemonListItem[]) {
  const seen = new Set(prev.map((p) => p.name));
  const merged = [...prev];
  for (const p of next) {
    if (!seen.has(p.name)) {
      seen.add(p.name);
      merged.push(p);
    }
  }
  return merged;
}

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setLoadingMore: (state, action) => {
      state.loadingMore = Boolean(action.payload);
    },
    resetPokemon: (state) => {
      state.items = [];
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.offset = 0;
      state.hasMore = true;
      state.count = 0;
      state.next = null;
      state.previous = null;
    },
    setLimit: (state, action) => {
      const v = Number(action.payload) || initialState.limit;
      state.limit = Math.min(Math.max(v, 10), 50);
      state.offset = 0;
      state.items = [];
      state.hasMore = true;
      state.error = null;
      state.count = 0;
      state.loadingMore = false;
    },
    appendPokemon: (state, action) => {
      const data = action.payload as PokemonListResponse;
      const nextResults = data?.results ?? [];

      state.items = mergeUnique(state.items, nextResults);
      state.offset = state.items.length;
      state.count = data?.count ?? state.count;
      state.hasMore = Boolean(data?.next) || state.items.length < (data?.count ?? state.items.length);
      state.next = data?.next ?? null;
      state.previous = data?.previous ?? null;
      state.loadingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonInitial.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPokemonInitial.fulfilled, (s, a) => {
        s.loading = false;
        const data = a.payload as PokemonListResponse;

        s.items = data?.results ?? [];
        s.offset = s.items.length;
        s.hasMore = Boolean(data?.next) || s.items.length < (data?.count ?? s.items.length);
        s.count = data?.count ?? s.items.length;
        s.next = data?.next ?? null;
        s.previous = data?.previous ?? null;
      })
      .addCase(fetchPokemonInitial.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? "Error al cargar Pokémon";
      })

      .addCase(fetchPokemonMore.pending, (s) => {
        s.loadingMore = true;
        s.error = null;
      })
      .addCase(fetchPokemonMore.fulfilled, (s, a) => {
        s.loadingMore = false;
        if (!a.payload) return;

        const data = a.payload as PokemonListResponse;
        const nextResults = data?.results ?? [];

        s.items = mergeUnique(s.items, nextResults);
        s.offset = s.items.length;
        s.hasMore = Boolean(data?.next) || s.items.length < (data?.count ?? s.items.length);
        s.count = data?.count ?? s.count;
        s.next = data?.next ?? null;
        s.previous = data?.previous ?? null;
      })
      .addCase(fetchPokemonMore.rejected, (s, a) => {
        s.loadingMore = false;
        s.error = a.error.message ?? "Error al cargar más Pokémon";
      });
  },
});

export const { resetPokemon, setLimit } = pokemonSlice.actions;
export const { appendPokemon, setLoadingMore } = pokemonSlice.actions;
export default pokemonSlice.reducer;
