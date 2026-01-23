import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PokemonService } from './pokemon.service';

@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemon: PokemonService) {}

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const l = limit ? Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100) : 20;
    const o = offset ? Math.max(parseInt(offset, 10) || 0, 0) : 0;

    return this.pokemon.list(l, o);
  }
}
