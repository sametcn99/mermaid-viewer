import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ThemeSettingsDto, SettingsResponseDto } from './settings.dto';

export class SyncSettingsRequestDto {
  @ApiPropertyOptional({ description: 'Mermaid config' })
  @IsObject()
  @IsOptional()
  mermaidConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ type: ThemeSettingsDto })
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  @IsOptional()
  themeSettings?: ThemeSettingsDto;

  @ApiPropertyOptional({ description: 'Key-value store' })
  @IsObject()
  @IsOptional()
  keyValueStore?: Record<string, unknown>;

  @ApiProperty()
  @IsNumber()
  clientTimestamp: number;

  @ApiProperty()
  @IsNumber()
  lastSyncTimestamp: number;
}

export class SyncSettingsResponseDto extends SettingsResponseDto {
  @ApiProperty()
  syncedAt: number;
}
