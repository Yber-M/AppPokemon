import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private signAccessToken(payload: { sub: number; email: string; role: string }) {
    return this.jwt.sign(payload);
  }

  private createRefreshTokenPlain() {
    return randomBytes(48).toString('hex');
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private parseDurationToMs(input: string, fallbackMs: number) {
    const m = input?.match(/^(\d+)([smhd])$/i);
    if (!m) return fallbackMs;
    const value = Number(m[1]);
    const unit = m[2].toLowerCase();
    const mult: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return value * (mult[unit] ?? fallbackMs);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return { user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signAccessToken({ sub: user.id, email: user.email, role: user.role });

    const refreshPlain = this.createRefreshTokenPlain();
    const refreshHash = this.hashToken(refreshPlain);

    const refreshExpiresIn = this.config.get<string>('REFRESH_EXPIRES_IN') || '7d';
    const ttlMs = this.parseDurationToMs(refreshExpiresIn, 7 * 86400000);
    const expiresAt = new Date(Date.now() + ttlMs);

    await this.prisma.refreshToken.create({
      data: { token: refreshHash, userId: user.id, expiresAt },
    });

    return {
      accessToken,
      refreshToken: refreshPlain,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }
}
