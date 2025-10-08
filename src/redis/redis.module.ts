import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';

@Module({
  controllers: [],
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
