import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class InvalidateCacheDto {
  @ApiProperty({ description: 'Search query to invalidate', example: 'test' })
  @IsString()
  @IsNotEmpty()
  q: string;
} 