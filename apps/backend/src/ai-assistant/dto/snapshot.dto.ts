import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDiagramSnapshotDto {
  @ApiProperty({ description: 'Message ID reference' })
  @IsString()
  messageId: string;

  @ApiPropertyOptional({
    description: 'Alias for message ID (messageClientId)',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value, obj }) => {
    const target = obj as Partial<CreateDiagramSnapshotDto>;
    if (target && !target.messageId && value) {
      target.messageId = String(value);
    }
    return typeof value === 'string' ? value : String(value);
  })
  messageClientId?: string;

  @ApiProperty({ description: 'Diagram code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Timestamp' })
  @IsNumber()
  timestamp: number;

  @ApiPropertyOptional({ description: 'Alias for timestamp (clientTimestamp)' })
  @IsNumber()
  @IsOptional()
  @Transform(({ value, obj }) => {
    const target = obj as Partial<CreateDiagramSnapshotDto>;
    if (target && target.timestamp === undefined && value !== undefined) {
      target.timestamp = Number(value);
    }
    return typeof value === 'number' ? value : Number(value);
  })
  clientTimestamp?: number;
}

export class DiagramSnapshotResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Server message ID reference' })
  messageId: string;

  @ApiProperty({ description: 'Client message ID, if provided' })
  messageClientId?: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ description: 'Server timestamp' })
  timestamp: number;

  @ApiProperty({ description: 'Client timestamp mirror' })
  clientTimestamp: number;
}
