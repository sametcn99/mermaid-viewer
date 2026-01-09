import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateDiagramDto } from './create-diagram.dto';

export class SyncDiagramDto extends CreateDiagramDto {
  @ApiProperty({ description: 'Client-side ID' })
  declare clientId: string;

  @ApiProperty({ description: 'Client-side timestamp' })
  declare clientTimestamp: number;
}

export class SyncDiagramsRequestDto {
  @ApiProperty({
    type: [SyncDiagramDto],
    description: 'Diagrams to sync from client',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDiagramDto)
  diagrams: SyncDiagramDto[];

  @ApiProperty({ description: 'Last sync timestamp from client' })
  lastSyncTimestamp: number;
}

export class DiagramResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ required: false, nullable: true, type: Object })
  settings: Record<string, unknown> | null;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientTimestamp: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SyncDiagramsResponseDto {
  @ApiProperty({
    type: [DiagramResponseDto],
    description: 'All diagrams after sync',
  })
  diagrams: DiagramResponseDto[];

  @ApiProperty({ description: 'Server sync timestamp' })
  syncedAt: number;
}
