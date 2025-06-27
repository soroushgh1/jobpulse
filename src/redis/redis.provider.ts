import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    let redis = new Redis({
      host: process.env.REDIS_HOST,
      port: 6379,
    });

    return redis;
  },
};