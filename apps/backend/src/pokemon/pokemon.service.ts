import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
  constructor(private readonly http: HttpService) {}

  async list(limit = 20, offset = 0) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    return this.fetchFromPokeApi(url);
  }

  async detail(nameOrId: string) {
    const safeValue = encodeURIComponent(nameOrId.trim().toLowerCase());
    const url = `https://pokeapi.co/api/v2/pokemon/${safeValue}`;
    return this.fetchFromPokeApi(url);
  }

  private async fetchFromPokeApi(url: string) {
    try {
      const res = await firstValueFrom(this.http.get(url, { timeout: 7000 }));
      return res.data;
    } catch {
      throw new BadGatewayException('PokeAPI unavailable');
    }
  }
}
