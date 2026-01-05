import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDiagramDto {
  @ApiProperty({ description: 'Diagram name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mermaid diagram code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Client-side ID for sync' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp for sync' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}
