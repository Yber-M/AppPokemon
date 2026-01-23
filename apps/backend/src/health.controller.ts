import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get('health')
  health() {
    return {
      ok: true,
      jwtExpiresIn: this.config.get('JWT_EXPIRES_IN'),
      refreshExpiresIn: this.config.get('REFRESH_EXPIRES_IN'),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { user: req.user };
  }
}
