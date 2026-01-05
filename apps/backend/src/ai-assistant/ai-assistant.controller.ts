import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { AiAssistantService } from './ai-assistant.service';
import {
  CreateChatMessageDto,
  ChatHistoryResponseDto,
  CreateDiagramSnapshotDto,
  DiagramSnapshotResponseDto,
  UpdateAiConfigDto,
  AiConfigResponseDto,
  SyncAiAssistantRequestDto,
  SyncAiAssistantResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('ai-assistant')
@ApiBearerAuth()
@Controller('ai')
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  // Chat
  @Post('chat/message')
  @ApiOperation({ summary: 'Add a chat message' })
  async addMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateChatMessageDto,
  ) {
    return this.aiAssistantService.addMessage(userId, dto);
  }

  @Get('chat/history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({ status: 200, type: ChatHistoryResponseDto })
  async getChatHistory(@CurrentUser('id') userId: string) {
    const messages = await this.aiAssistantService.getChatHistory(userId);
    const lastUpdated =
      messages.length > 0
        ? Math.max(...messages.map((m) => Number(m.timestamp)))
        : Date.now();

    return {
      messages,
      lastUpdated,
    };
  }

  @Delete('chat/history')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear chat history' })
  async clearChatHistory(@CurrentUser('id') userId: string) {
    return this.aiAssistantService.clearChatHistory(userId);
  }

  // Snapshots
  @Post('snapshots')
  @ApiOperation({ summary: 'Save diagram snapshots (replaces all)' })
  @ApiResponse({ status: 201, type: [DiagramSnapshotResponseDto] })
  async saveSnapshots(
    @CurrentUser('id') userId: string,
    @Body() snapshots: CreateDiagramSnapshotDto[],
  ) {
    return this.aiAssistantService.saveSnapshots(userId, snapshots);
  }

  @Get('snapshots')
  @ApiOperation({ summary: 'Get all diagram snapshots' })
  @ApiResponse({ status: 200, type: [DiagramSnapshotResponseDto] })
  async getSnapshots(@CurrentUser('id') userId: string) {
    return this.aiAssistantService.getSnapshots(userId);
  }

  @Delete('snapshots')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear all snapshots' })
  async clearSnapshots(@CurrentUser('id') userId: string) {
    return this.aiAssistantService.clearSnapshots(userId);
  }

  // Config
  @Get('config')
  @ApiOperation({ summary: 'Get AI config' })
  @ApiResponse({ status: 200, type: AiConfigResponseDto })
  async getConfig(@CurrentUser('id') userId: string) {
    const config = await this.aiAssistantService.getConfig(userId);
    return {
      consentGiven: config.consentGiven,
      hasApiKey: !!config.userApiKey,
      selectedModel: config.selectedModel,
      lastConsentDate: config.lastConsentDate
        ? Number(config.lastConsentDate)
        : undefined,
    };
  }

  @Patch('config')
  @ApiOperation({ summary: 'Update AI config' })
  @ApiResponse({ status: 200, type: AiConfigResponseDto })
  async updateConfig(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAiConfigDto,
  ) {
    const config = await this.aiAssistantService.updateConfig(userId, dto);
    return {
      consentGiven: config.consentGiven,
      hasApiKey: !!config.userApiKey,
      selectedModel: config.selectedModel,
      lastConsentDate: config.lastConsentDate
        ? Number(config.lastConsentDate)
        : undefined,
    };
  }

  // Sync
  @Post('sync')
  @ApiOperation({ summary: 'Sync AI assistant data' })
  @ApiResponse({ status: 200, type: SyncAiAssistantResponseDto })
  async sync(
    @CurrentUser('id') userId: string,
    @Body() syncRequest: SyncAiAssistantRequestDto,
  ): Promise<SyncAiAssistantResponseDto> {
    return this.aiAssistantService.sync(userId, syncRequest);
  }
}
