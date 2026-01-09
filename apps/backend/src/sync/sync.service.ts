import { Injectable } from '@nestjs/common';
import { DiagramsService } from '../diagrams/diagrams.service';
import { TemplatesService } from '../templates/templates.service';
import { SettingsService } from '../settings/settings.service';
import { FullSyncRequestDto, FullSyncResponseDto } from './dto';

@Injectable()
export class SyncService {
  constructor(
    private readonly diagramsService: DiagramsService,
    private readonly templatesService: TemplatesService,
    private readonly settingsService: SettingsService,
  ) {}

  async fullSync(
    userId: string,
    syncRequest: FullSyncRequestDto,
  ): Promise<FullSyncResponseDto> {
    const diagramSection = syncRequest.diagrams;
    const templateSection = syncRequest.templates;
    const settingsSection = syncRequest.settings;

    const resolvedLastSync =
      diagramSection.lastSyncAt ??
      templateSection.lastSyncAt ??
      settingsSection.lastSyncAt ??
      0;
    const isFirstSync = resolvedLastSync === 0;

    // 1. Sync Diagrams
    const diagramsResult = await this.diagramsService.sync(userId, {
      diagrams: diagramSection.diagrams,
      lastSyncTimestamp: diagramSection.lastSyncAt ?? 0,
    });

    // 2. Sync Templates (collections + favorites)
    const templatesResult = await this.templatesService.sync(userId, {
      collections: templateSection.collections,
      favorites: templateSection.favorites,
      lastSyncTimestamp: templateSection.lastSyncAt ?? 0,
    });

    // 4. Sync Settings
    const settingsPayload = settingsSection.settings ?? {};
    const computedClientTimestamp =
      settingsPayload.updatedAt ??
      settingsSection.lastSyncAt ??
      resolvedLastSync ??
      Date.now();
    const settingsResult = await this.settingsService.sync(userId, {
      mermaidConfig: settingsPayload.mermaidConfig,
      themeSettings: settingsPayload.themeSettings,
      keyValueStore: settingsPayload.keyValueStore,
      clientTimestamp: computedClientTimestamp,
      lastSyncTimestamp: settingsSection.lastSyncAt ?? 0,
    });

    const syncedAt = Date.now();

    return {
      diagrams: {
        diagrams: diagramsResult.diagrams,
        syncedAt: diagramsResult.syncedAt,
      },
      templates: {
        collections: templatesResult.collections,
        favorites: templatesResult.favorites,
        syncedAt: templatesResult.syncedAt,
      },
      settings: {
        settings: {
          mermaidConfig: settingsResult.mermaidConfig || {},
          themeSettings: settingsResult.themeSettings || {
            themeMode: 'default',
          },
          keyValueStore: settingsResult.keyValueStore || {},
          updatedAt:
            settingsResult.clientTimestamp ??
            settingsResult.updatedAt?.getTime() ??
            Date.now(),
        },
        syncedAt: settingsResult.syncedAt,
      },
      syncedAt,
      isFirstSync,
    };
  }
}
