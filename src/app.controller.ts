import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { InvalidateCacheDto } from './dto/invalidate-cache.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { AppService } from './app.service';

@ApiTags('Search')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search with caching' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query() query: SearchQueryDto) {
    return this.appService.search(query);
  }

  @Post('precache')
  @ApiOperation({ summary: 'Pre-cache top 10 popular queries' })
  @ApiResponse({ status: 200, description: 'Pre-cached' })
  async precache() {
    return this.appService.precache();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Top 10 most popular queries' })
  @ApiResponse({ status: 200, description: 'Top 10 queries' })
  async stats() {
    return this.appService.stats();
  }

  @Delete('cache')
  @SkipThrottle()
  @ApiOperation({ summary: 'Invalidate cache for a specific query' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query to invalidate' })
  @ApiResponse({ status: 200, description: 'Cache invalidated' })
  async invalidate(@Query() query: InvalidateCacheDto) {
    return this.appService.invalidate(query);
  }
} 