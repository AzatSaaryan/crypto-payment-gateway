import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => {
    const client = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    });

    client.on('connect', () => {
      console.log('Redis connected');
    });

    client.on('error', (err) => console.error('❌ Redis error:', err));

    return client;
  },
};
