// redis.module.ts
import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT, redisProvider } from './redis.provider';

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
