import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import {
  UpdateMermaidConfigDto,
  UpdateThemeSettingsDto,
  KeyValueDto,
  SettingsResponseDto,
  SyncSettingsRequestDto,
  SyncSettingsResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, type: SettingsResponseDto })
  async getSettings(@CurrentUser('id') userId: string) {
    const settings = await this.settingsService.getSettings(userId);
    return this.settingsService.toResponseDto(settings);
  }

  // Mermaid Config
  @Put('mermaid')
  @ApiOperation({ summary: 'Update mermaid configuration' })
  @ApiResponse({ status: 200, type: SettingsResponseDto })
  async updateMermaidConfig(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateMermaidConfigDto,
  ) {
    const settings = await this.settingsService.updateMermaidConfig(
      userId,
      dto,
    );
    return this.settingsService.toResponseDto(settings);
  }

  @Get('mermaid')
  @ApiOperation({ summary: 'Get mermaid configuration' })
  async getMermaidConfig(@CurrentUser('id') userId: string) {
    const settings = await this.settingsService.getSettings(userId);
    return { config: settings.mermaidConfig };
  }

  // Theme Settings
  @Put('theme')
  @ApiOperation({ summary: 'Update theme settings' })
  @ApiResponse({ status: 200, type: SettingsResponseDto })
  async updateThemeSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateThemeSettingsDto,
  ) {
    const settings = await this.settingsService.updateThemeSettings(
      userId,
      dto,
    );
    return this.settingsService.toResponseDto(settings);
  }

  @Get('theme')
  @ApiOperation({ summary: 'Get theme settings' })
  async getThemeSettings(@CurrentUser('id') userId: string) {
    const settings = await this.settingsService.getSettings(userId);
    return { themeSettings: settings.themeSettings };
  }

  // Key-Value Store
  @Get('kv/:key')
  @ApiOperation({ summary: 'Get a key-value pair' })
  async getKeyValue(
    @CurrentUser('id') userId: string,
    @Param('key') key: string,
  ) {
    const value = await this.settingsService.getKeyValue(userId, key);
    return { key, value };
  }

  @Put('kv')
  @ApiOperation({ summary: 'Set a key-value pair' })
  async setKeyValue(
    @CurrentUser('id') userId: string,
    @Body() dto: KeyValueDto,
  ) {
    await this.settingsService.setKeyValue(userId, dto.key, dto.value);
    return { key: dto.key, value: dto.value };
  }

  @Delete('kv/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a key-value pair' })
  async deleteKeyValue(
    @CurrentUser('id') userId: string,
    @Param('key') key: string,
  ) {
    await this.settingsService.deleteKeyValue(userId, key);
  }

  @Get('kv')
  @ApiOperation({ summary: 'Get all key-value pairs' })
  async getAllKeyValues(@CurrentUser('id') userId: string) {
    const settings = await this.settingsService.getSettings(userId);
    return { keyValueStore: settings.keyValueStore };
  }

  // Sync
  @Post('sync')
  @ApiOperation({ summary: 'Sync settings with client' })
  @ApiResponse({ status: 200, type: SyncSettingsResponseDto })
  async sync(
    @CurrentUser('id') userId: string,
    @Body() syncRequest: SyncSettingsRequestDto,
  ): Promise<SyncSettingsResponseDto> {
    return this.settingsService.sync(userId, syncRequest);
  }
}
