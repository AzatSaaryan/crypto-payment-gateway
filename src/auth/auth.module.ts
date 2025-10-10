import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { AppJwtModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, RedisModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
