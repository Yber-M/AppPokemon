import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
  constructor(private readonly http: HttpService) {}

  async list(limit = 20, offset = 0) {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
      const res = await firstValueFrom(this.http.get(url, { timeout: 7000 }));
      return res.data;
    } catch {
      throw new BadGatewayException('PokeAPI unavailable');
    }
  }
}
