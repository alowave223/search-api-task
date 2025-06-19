import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query', example: 'test' })
  @IsString()
  @IsNotEmpty()
  q: string;
} 