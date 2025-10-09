import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, JwtModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
