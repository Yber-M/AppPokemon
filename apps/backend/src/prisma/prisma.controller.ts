import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('debug')
export class PrismaDebugController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('db')
  async db() {
    const usersCount = await this.prisma.user.count();
    return { ok: true, usersCount };
  }
}
