import { ApiProperty } from '@nestjs/swagger';
import { DiagramResponseDto } from '../../diagrams/dto/sync-diagrams.dto';
import {
  CollectionResponseDto,
  SyncFavoriteDto,
} from '../../templates/dto/sync-templates.dto';
import { ThemeSettingsDto } from '../../settings/dto/settings.dto';

export class FullSyncDiagramsResponseDto {
  @ApiProperty({ type: [DiagramResponseDto] })
  diagrams: DiagramResponseDto[];

  @ApiProperty({ description: 'Server sync timestamp' })
  syncedAt: number;
}

export class FullSyncTemplatesResponseDto {
  @ApiProperty({ type: [CollectionResponseDto] })
  collections: CollectionResponseDto[];

  @ApiProperty({ type: [SyncFavoriteDto] })
  favorites: SyncFavoriteDto[];

  @ApiProperty({ description: 'Server sync timestamp' })
  syncedAt: number;
}

export class FullSyncSettingsPayloadResponseDto {
  @ApiProperty()
  mermaidConfig: Record<string, unknown>;

  @ApiProperty({ type: ThemeSettingsDto })
  themeSettings: ThemeSettingsDto | { themeMode: 'default' };

  @ApiProperty()
  keyValueStore: Record<string, unknown>;

  @ApiProperty({ description: 'Client timestamp used for settings' })
  updatedAt: number;
}

export class FullSyncSettingsResponseDto {
  @ApiProperty({ type: FullSyncSettingsPayloadResponseDto })
  settings: FullSyncSettingsPayloadResponseDto;

  @ApiProperty({ description: 'Server sync timestamp' })
  syncedAt: number;
}

export class FullSyncResponseDto {
  @ApiProperty({ type: FullSyncDiagramsResponseDto })
  diagrams: FullSyncDiagramsResponseDto;

  @ApiProperty({ type: FullSyncTemplatesResponseDto })
  templates: FullSyncTemplatesResponseDto;

  @ApiProperty({ type: FullSyncSettingsResponseDto })
  settings: FullSyncSettingsResponseDto;

  @ApiProperty({ description: 'Overall sync timestamp' })
  syncedAt: number;

  @ApiProperty({ description: 'Is this the first sync for the user' })
  isFirstSync: boolean;
}
