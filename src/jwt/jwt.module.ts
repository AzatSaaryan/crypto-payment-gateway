import { Module } from '@nestjs/common';
import { AppJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [JwtModule.register({}), RedisModule],
  controllers: [],
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class AppJwtModule {}
