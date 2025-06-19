import { Module, DynamicModule, Global } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

export interface RedisModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  inject?: any[];
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions = {}): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: () => new Redis(options),
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (...args: any[]) => {
            const redisOptions = await options.useFactory(...args);
            return new Redis(redisOptions);
          },
          inject: options.inject || [],
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
} 