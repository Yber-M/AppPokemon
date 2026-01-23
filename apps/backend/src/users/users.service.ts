import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email }, select: { id: true } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role ?? 'USER',
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const current = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!current) throw new NotFoundException('User not found');

    if (dto.email) {
      const emailTaken = await this.prisma.user.findUnique({ where: { email: dto.email }, select: { id: true } });
      if (emailTaken && emailTaken.id !== id) throw new ConflictException('Email already in use');
    }

    const data: any = { ...dto };

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
      delete data.password;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    });
  }

  async remove(id: number) {
    const current = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!current) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
