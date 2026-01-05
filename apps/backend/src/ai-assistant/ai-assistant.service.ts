import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage, DiagramSnapshot, AiConfig } from './entities';
import {
  CreateChatMessageDto,
  ChatMessageResponseDto,
  CreateDiagramSnapshotDto,
  DiagramSnapshotResponseDto,
  UpdateAiConfigDto,
  AiConfigResponseDto,
  SyncAiAssistantRequestDto,
  SyncAiAssistantResponseDto,
} from './dto';

@Injectable()
export class AiAssistantService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(DiagramSnapshot)
    private readonly snapshotRepository: Repository<DiagramSnapshot>,
    @InjectRepository(AiConfig)
    private readonly configRepository: Repository<AiConfig>,
  ) {}

  // Chat Messages
  async addMessage(
    userId: string,
    dto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create({
      userId,
      ...dto,
    });
    return this.chatMessageRepository.save(message);
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { userId },
      order: { timestamp: 'ASC' },
    });
  }

  async clearChatHistory(userId: string): Promise<void> {
    await this.chatMessageRepository.delete({ userId });
  }

  // Diagram Snapshots
  async saveSnapshots(
    userId: string,
    snapshots: CreateDiagramSnapshotDto[],
  ): Promise<DiagramSnapshot[]> {
    // Clear existing snapshots for user
    await this.snapshotRepository.delete({ userId });

    // Save new snapshots
    const entities = snapshots.map((s) =>
      this.snapshotRepository.create({
        userId,
        messageId: s.messageId,
        code: s.code,
        timestamp: s.timestamp,
      }),
    );

    return this.snapshotRepository.save(entities);
  }

  async getSnapshots(userId: string): Promise<DiagramSnapshot[]> {
    return this.snapshotRepository.find({
      where: { userId },
      order: { timestamp: 'ASC' },
    });
  }

  async clearSnapshots(userId: string): Promise<void> {
    await this.snapshotRepository.delete({ userId });
  }

  // AI Config
  async getConfig(userId: string): Promise<AiConfig> {
    let config = await this.configRepository.findOne({
      where: { userId },
    });

    if (!config) {
      config = this.configRepository.create({
        userId,
        consentGiven: false,
      });
      await this.configRepository.save(config);
    }

    return config;
  }

  async updateConfig(
    userId: string,
    dto: UpdateAiConfigDto,
  ): Promise<AiConfig> {
    let config = await this.getConfig(userId);
    Object.assign(config, dto);
    return this.configRepository.save(config);
  }

  // Sync
  async sync(
    userId: string,
    syncRequest: SyncAiAssistantRequestDto,
  ): Promise<SyncAiAssistantResponseDto> {
    const existingMessages = await this.getChatHistory(userId);
    const existingByClientId = new Map<string, ChatMessage>();

    for (const msg of existingMessages) {
      if (msg.clientId) {
        existingByClientId.set(msg.clientId, msg);
      }
    }

    // Process incoming messages
    for (const clientMsg of syncRequest.messages) {
      if (clientMsg.clientId && existingByClientId.has(clientMsg.clientId)) {
        // Already exists, skip
        continue;
      }

      await this.addMessage(userId, clientMsg);
    }

    // Process snapshots - replace all
    if (syncRequest.snapshots.length > 0) {
      await this.saveSnapshots(userId, syncRequest.snapshots);
    }

    // Update config if provided
    if (syncRequest.config) {
      await this.updateConfig(userId, syncRequest.config);
    }

    // Return all data
    const allMessages = await this.getChatHistory(userId);
    const allSnapshots = await this.getSnapshots(userId);
    const config = await this.getConfig(userId);

    return {
      messages: allMessages.map(this.toMessageResponseDto),
      snapshots: allSnapshots.map(this.toSnapshotResponseDto),
      config: this.toConfigResponseDto(config),
      syncedAt: Date.now(),
    };
  }

  async bulkSaveMessages(
    userId: string,
    messages: CreateChatMessageDto[],
  ): Promise<ChatMessage[]> {
    const entities = messages.map((m) =>
      this.chatMessageRepository.create({
        userId,
        ...m,
      }),
    );
    return this.chatMessageRepository.save(entities);
  }

  private toMessageResponseDto(message: ChatMessage): ChatMessageResponseDto {
    const timestamp = Number(message.timestamp);
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      diagramCode: message.diagramCode,
      timestamp,
      clientTimestamp: timestamp,
      clientId: message.clientId,
    };
  }

  private toSnapshotResponseDto(
    snapshot: DiagramSnapshot,
  ): DiagramSnapshotResponseDto {
    const timestamp = Number(snapshot.timestamp);
    return {
      id: snapshot.id,
      messageId: snapshot.messageId,
      messageClientId: snapshot.messageId,
      code: snapshot.code,
      timestamp,
      clientTimestamp: timestamp,
    };
  }

  private toConfigResponseDto(config: AiConfig): AiConfigResponseDto {
    return {
      consentGiven: config.consentGiven,
      userApiKey: undefined,
      selectedModel: config.selectedModel,
      lastConsentDate: config.lastConsentDate
        ? Number(config.lastConsentDate)
        : undefined,
      updatedAt: config.updatedAt?.getTime() ?? Date.now(),
    };
  }
}
