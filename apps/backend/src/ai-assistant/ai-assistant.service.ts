import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decryptContent, encryptContent } from '../common/crypto.util';
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
    const encryptedDiagramCode = encryptContent(dto.diagramCode);
    const message = this.chatMessageRepository.create({
      userId,
      ...dto,
      diagramCode: encryptedDiagramCode,
    });
    return this.chatMessageRepository.save(message);
  }

  async getChatHistory(userId: string): Promise<ChatMessageResponseDto[]> {
    const messages = await this.chatMessageRepository.find({
      where: { userId },
      order: { timestamp: 'ASC' },
    });
    return messages.map((m) => this.toMessageResponseDto(m));
  }

  async clearChatHistory(userId: string): Promise<void> {
    await this.chatMessageRepository.delete({ userId });
  }

  // Diagram Snapshots
  async saveSnapshots(
    userId: string,
    snapshots: CreateDiagramSnapshotDto[],
  ): Promise<DiagramSnapshotResponseDto[]> {
    // Clear existing snapshots for user
    await this.snapshotRepository.delete({ userId });

    // Save new snapshots
    const entities = snapshots.map((s) =>
      this.snapshotRepository.create({
        userId,
        messageId: s.messageId,
        code: encryptContent(s.code),
        timestamp: s.timestamp,
      }),
    );

    const saved = await this.snapshotRepository.save(entities);

    return saved.map((s) => this.toSnapshotResponseDto(s));
  }

  async getSnapshots(userId: string): Promise<DiagramSnapshotResponseDto[]> {
    const snapshots = await this.snapshotRepository.find({
      where: { userId },
      order: { timestamp: 'ASC' },
    });
    return snapshots.map((s) => this.toSnapshotResponseDto(s));
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
    const config = await this.getConfig(userId);
    Object.assign(config, dto);
    return this.configRepository.save(config);
  }

  // Sync
  async sync(
    userId: string,
    syncRequest: SyncAiAssistantRequestDto,
  ): Promise<SyncAiAssistantResponseDto> {
    const existingMessages = await this.getChatHistory(userId);
    const existingByClientId = new Map<string, ChatMessageResponseDto>();

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
      messages: allMessages,
      snapshots: allSnapshots,
      config: this.toConfigResponseDto(config),
      syncedAt: Date.now(),
    };
  }

  async bulkSaveMessages(
    userId: string,
    messages: CreateChatMessageDto[],
  ): Promise<ChatMessageResponseDto[]> {
    const entities = messages.map((m) =>
      this.chatMessageRepository.create({
        userId,
        ...m,
        diagramCode: encryptContent(m.diagramCode),
      }),
    );
    const saved = await this.chatMessageRepository.save(entities);
    return saved.map((m) => this.toMessageResponseDto(m));
  }

  private toMessageResponseDto(message: ChatMessage): ChatMessageResponseDto {
    const timestamp = Number(message.timestamp);
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      diagramCode: this.decryptCode(message.diagramCode),
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
      code: this.decryptCode(snapshot.code),
      timestamp,
      clientTimestamp: timestamp,
    };
  }

  private decryptCode(value?: string | null): string {
    if (value === undefined || value === null) {
      return '';
    }

    try {
      return decryptContent(value) ?? '';
    } catch (_) {
      // If legacy plaintext exists, return as-is to avoid breaking responses.
      return value;
    }
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
