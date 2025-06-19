import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { SearchQueryDto } from './dto/search-query.dto';
import { InvalidateCacheDto } from './dto/invalidate-cache.dto';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async search(query: SearchQueryDto) {
    const cacheKey = `search:cache:${query.q}`;

    let result = await this.redis.get(cacheKey);

    if (result) return JSON.parse(result);

    await new Promise(res => setTimeout(res, 2000 + Math.random() * 1000));
    result = JSON.stringify({ q: query.q, results: [`Result for ${query.q}`] });

    await this.redis.set(cacheKey, result, 'EX', 600);
    await this.redis.zincrby('search:popular', 1, query.q);

    const date = new Date().toISOString().slice(0, 10);
    await this.redis.lpush(`search:log:${date}`, query.q);

    return JSON.parse(result);
  }

  async precache() {
    const popular = await this.redis.zrevrange('search:popular', 0, 9);
    for (const q of popular) {
      const cacheKey = `search:cache:${q}`;

      if (!(await this.redis.exists(cacheKey))) {
        await new Promise(res => setTimeout(res, 2000 + Math.random() * 1000));

        const result = JSON.stringify({ q, results: [`Result for ${q}`] });

        await this.redis.set(cacheKey, result, 'EX', 600);
      }
    }

    return { status: 'ok', precached: popular };
  }

  async stats() {
    const top = await this.redis.zrevrange('search:popular', 0, 9, 'WITHSCORES');

    return top;
  }

  async invalidate(query: InvalidateCacheDto) {
    await this.redis.del(`search:cache:${query.q}`);

    return { status: 'deleted' };
  }
} 