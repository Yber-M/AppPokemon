import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
  constructor(private readonly http: HttpService) {}

  async list(limit = 20, offset = 0): Promise<unknown> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    return this.fetchFromPokeApi(url);
  }

  async detail(nameOrId: string): Promise<unknown> {
    const safeValue = encodeURIComponent(nameOrId.trim().toLowerCase());
    const url = `https://pokeapi.co/api/v2/pokemon/${safeValue}`;
    return this.fetchFromPokeApi(url);
  }

  private async fetchFromPokeApi<T = unknown>(url: string): Promise<T> {
    try {
      const res = await firstValueFrom(
        this.http.get<T>(url, { timeout: 7000 }),
      );
      return res.data;
    } catch {
      throw new BadGatewayException('PokeAPI unavailable');
    }
  }
}
