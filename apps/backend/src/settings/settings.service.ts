import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import {
  UpdateMermaidConfigDto,
  UpdateThemeSettingsDto,
  SettingsResponseDto,
  SyncSettingsRequestDto,
  SyncSettingsResponseDto,
} from './dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly settingsRepository: Repository<UserSettings>,
  ) {}

  async getSettings(userId: string): Promise<UserSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        keyValueStore: {},
      });
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateMermaidConfig(
    userId: string,
    dto: UpdateMermaidConfigDto,
  ): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    settings.mermaidConfig = dto.config;
    if (dto.clientTimestamp) {
      settings.clientTimestamp = dto.clientTimestamp;
    }
    return this.settingsRepository.save(settings);
  }

  async updateThemeSettings(
    userId: string,
    dto: UpdateThemeSettingsDto,
  ): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    settings.themeSettings = dto.themeSettings;
    if (dto.clientTimestamp) {
      settings.clientTimestamp = dto.clientTimestamp;
    }
    return this.settingsRepository.save(settings);
  }

  async getKeyValue(userId: string, key: string): Promise<unknown> {
    const settings = await this.getSettings(userId);
    return settings.keyValueStore?.[key];
  }

  async setKeyValue(
    userId: string,
    key: string,
    value: unknown,
  ): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    if (!settings.keyValueStore) {
      settings.keyValueStore = {};
    }
    settings.keyValueStore[key] = value;
    return this.settingsRepository.save(settings);
  }

  async deleteKeyValue(userId: string, key: string): Promise<UserSettings> {
    const settings = await this.getSettings(userId);
    if (settings.keyValueStore) {
      delete settings.keyValueStore[key];
      await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async sync(
    userId: string,
    syncRequest: SyncSettingsRequestDto,
  ): Promise<SyncSettingsResponseDto> {
    const settings = await this.getSettings(userId);

    // If client data is newer, update server
    if (syncRequest.clientTimestamp > (settings.clientTimestamp || 0)) {
      if (syncRequest.mermaidConfig) {
        settings.mermaidConfig = syncRequest.mermaidConfig;
      }
      if (syncRequest.themeSettings) {
        settings.themeSettings = syncRequest.themeSettings;
      }
      if (syncRequest.keyValueStore) {
        settings.keyValueStore = {
          ...settings.keyValueStore,
          ...syncRequest.keyValueStore,
        };
      }
      settings.clientTimestamp = syncRequest.clientTimestamp;
      await this.settingsRepository.save(settings);
    }

    // Return current settings
    return {
      mermaidConfig: settings.mermaidConfig,
      themeSettings: settings.themeSettings,
      keyValueStore: settings.keyValueStore,
      updatedAt: settings.updatedAt,
      clientTimestamp: settings.clientTimestamp,
      syncedAt: Date.now(),
    };
  }

  toResponseDto(settings: UserSettings): SettingsResponseDto {
    return {
      mermaidConfig: settings.mermaidConfig,
      themeSettings: settings.themeSettings,
      keyValueStore: settings.keyValueStore,
      updatedAt: settings.updatedAt,
      clientTimestamp: settings.clientTimestamp,
    };
  }
}
