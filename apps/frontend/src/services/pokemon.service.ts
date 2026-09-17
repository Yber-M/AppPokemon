import { api } from "./api";
import { PokemonDetailResponse, PokemonListResponse } from "@/src/types/pokemon.types";

export const pokemonService = {
  list: async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
    const res = await api.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
    return res.data;
  },
  detail: async (nameOrId: string): Promise<PokemonDetailResponse> => {
    const res = await api.get<PokemonDetailResponse>(`/pokemon/${encodeURIComponent(nameOrId)}`);
    return res.data;
  },
};
