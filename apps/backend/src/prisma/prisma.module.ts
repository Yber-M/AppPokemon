import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaDebugController } from './prisma.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [PrismaDebugController],
})
export class PrismaModule {}
