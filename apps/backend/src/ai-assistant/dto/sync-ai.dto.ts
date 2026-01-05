import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { CreateChatMessageDto, ChatMessageResponseDto } from './chat.dto';
import {
  CreateDiagramSnapshotDto,
  DiagramSnapshotResponseDto,
} from './snapshot.dto';
import { UpdateAiConfigDto, AiConfigResponseDto } from './config.dto';

export class SyncAiAssistantRequestDto {
  @ApiProperty({ type: [CreateChatMessageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChatMessageDto)
  messages: CreateChatMessageDto[];

  @ApiProperty({ type: [CreateDiagramSnapshotDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiagramSnapshotDto)
  snapshots: CreateDiagramSnapshotDto[];

  @ApiPropertyOptional({ type: UpdateAiConfigDto })
  @ValidateNested()
  @Type(() => UpdateAiConfigDto)
  @IsOptional()
  config?: UpdateAiConfigDto;

  @ApiProperty()
  @IsNumber()
  lastSyncTimestamp: number;
}

export class SyncAiAssistantResponseDto {
  @ApiProperty({ type: [ChatMessageResponseDto] })
  messages: ChatMessageResponseDto[];

  @ApiProperty({ type: [DiagramSnapshotResponseDto] })
  snapshots: DiagramSnapshotResponseDto[];

  @ApiProperty({ type: AiConfigResponseDto })
  config: AiConfigResponseDto;

  @ApiProperty()
  syncedAt: number;
}
