import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDiagramDto {
  @ApiPropertyOptional({ description: 'Diagram name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Mermaid diagram code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp for sync' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}
