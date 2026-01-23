import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
}
