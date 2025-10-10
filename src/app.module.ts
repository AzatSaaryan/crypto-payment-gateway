import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AppJwtModule } from './jwt/jwt.module';
import { DepositsModule } from './deposits/deposits.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, AppJwtModule, DepositsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
