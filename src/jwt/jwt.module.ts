import { Module } from '@nestjs/common';
import { AppJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [JwtModule.register({}), RedisModule],
  controllers: [],
  providers: [AppJwtService, JwtStrategy, JwtAuthGuard],
  exports: [AppJwtService, JwtStrategy, JwtAuthGuard],
})
export class AppJwtModule {}
