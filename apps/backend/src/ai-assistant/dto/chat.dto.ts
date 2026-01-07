import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty({ description: 'Message content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Diagram code if any' })
  @IsString()
  @IsOptional()
  diagramCode?: string;

  @ApiProperty({ description: 'Client timestamp' })
  @IsNumber()
  timestamp: number;

  @ApiPropertyOptional({
    description: 'Alias for client timestamp (clientTimestamp)',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value, obj }) => {
    const target = obj as Partial<CreateChatMessageDto>;
    if (target && target.timestamp === undefined && value !== undefined) {
      target.timestamp = Number(value);
    }
    return typeof value === 'number' ? value : Number(value);
  })
  clientTimestamp?: number;

  @ApiPropertyOptional({ description: 'Client-side message ID' })
  @IsString()
  @IsOptional()
  clientId?: string;
}

export class ChatMessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: 'user' | 'assistant';

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  diagramCode?: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty({ description: 'Client timestamp alias for compatibility' })
  clientTimestamp: number;

  @ApiPropertyOptional()
  clientId?: string;
}

export class ChatHistoryResponseDto {
  @ApiProperty({ type: [ChatMessageResponseDto] })
  messages: ChatMessageResponseDto[];

  @ApiProperty()
  lastUpdated: number;
}
