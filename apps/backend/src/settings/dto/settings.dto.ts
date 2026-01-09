import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomColorsDto {
  @ApiProperty()
  @IsString()
  primary: string;

  @ApiProperty()
  @IsString()
  secondary: string;

  @ApiProperty()
  @IsString()
  background: string;

  @ApiProperty()
  @IsString()
  paper: string;

  @ApiProperty()
  @IsString()
  textPrimary: string;

  @ApiProperty()
  @IsString()
  textSecondary: string;

  @ApiProperty()
  @IsString()
  divider: string;

  @ApiProperty({ enum: ['light', 'dark'] })
  @IsString()
  mode: 'light' | 'dark';
}

export class ThemeSettingsDto {
  @ApiProperty({ enum: ['default', 'light', 'dark', 'custom'] })
  @IsString()
  themeMode: 'default' | 'light' | 'dark' | 'custom';

  @ApiPropertyOptional({ type: CustomColorsDto })
  @ValidateNested()
  @Type(() => CustomColorsDto)
  @IsOptional()
  customColors?: CustomColorsDto;
}

export class UpdateMermaidConfigDto {
  @ApiProperty({ description: 'Mermaid configuration object' })
  @IsObject()
  config: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class UpdateThemeSettingsDto {
  @ApiProperty({ type: ThemeSettingsDto })
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  themeSettings: ThemeSettingsDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class KeyValueDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ description: 'Value (will be JSON stringified)' })
  value: unknown;
}

export class SettingsResponseDto {
  @ApiPropertyOptional()
  mermaidConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ type: ThemeSettingsDto })
  themeSettings?: ThemeSettingsDto;

  @ApiPropertyOptional()
  keyValueStore?: Record<string, unknown>;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  clientTimestamp?: number;
}
