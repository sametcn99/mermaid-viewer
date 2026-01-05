import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({ description: 'Built-in template ID' })
  @IsString()
  templateId: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class FavoriteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  templateId: string;

  @ApiProperty()
  createdAt: Date;
}
