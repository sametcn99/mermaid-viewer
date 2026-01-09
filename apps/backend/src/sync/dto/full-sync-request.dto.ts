import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';
import { SyncDiagramDto } from '../../diagrams/dto/sync-diagrams.dto';
import {
  SyncCollectionDto,
  SyncFavoriteDto,
} from '../../templates/dto/sync-templates.dto';
import { ThemeSettingsDto } from '../../settings/dto/settings.dto';

export class FullSyncDiagramsSectionDto {
  @ApiProperty({ type: [SyncDiagramDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDiagramDto)
  diagrams: SyncDiagramDto[];

  @ApiPropertyOptional({ description: 'Last sync timestamp from client' })
  @IsNumber()
  @IsOptional()
  lastSyncAt?: number;
}

export class FullSyncTemplatesSectionDto {
  @ApiProperty({ type: [SyncCollectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCollectionDto)
  collections: SyncCollectionDto[];

  @ApiProperty({ type: [SyncFavoriteDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncFavoriteDto)
  favorites: SyncFavoriteDto[];

  @ApiPropertyOptional({ description: 'Last sync timestamp from client' })
  @IsNumber()
  @IsOptional()
  lastSyncAt?: number;
}

export class FullSyncSettingsPayloadDto {
  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  mermaidConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ type: ThemeSettingsDto })
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  @IsOptional()
  themeSettings?: ThemeSettingsDto;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  keyValueStore?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Client timestamp for settings' })
  @IsNumber()
  @IsOptional()
  updatedAt?: number;
}

export class FullSyncSettingsSectionDto {
  @ApiProperty({ type: FullSyncSettingsPayloadDto })
  @ValidateNested()
  @Type(() => FullSyncSettingsPayloadDto)
  settings: FullSyncSettingsPayloadDto;

  @ApiPropertyOptional({ description: 'Last sync timestamp from client' })
  @IsNumber()
  @IsOptional()
  lastSyncAt?: number;
}

export class FullSyncRequestDto {
  @ApiProperty({ type: FullSyncDiagramsSectionDto })
  @ValidateNested()
  @Type(() => FullSyncDiagramsSectionDto)
  diagrams: FullSyncDiagramsSectionDto;

  @ApiProperty({ type: FullSyncTemplatesSectionDto })
  @ValidateNested()
  @Type(() => FullSyncTemplatesSectionDto)
  templates: FullSyncTemplatesSectionDto;

  @ApiProperty({ type: FullSyncSettingsSectionDto })
  @ValidateNested()
  @Type(() => FullSyncSettingsSectionDto)
  settings: FullSyncSettingsSectionDto;
}
