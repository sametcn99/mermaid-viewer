import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { CreateCollectionDto } from './collection.dto';
import { AddFavoriteDto } from './favorite.dto';

export class SyncCollectionDto extends CreateCollectionDto {
  @ApiProperty({ description: 'Client-side ID' })
  declare clientId: string;

  @ApiProperty({ description: 'Client-side timestamp' })
  declare clientTimestamp: number;
}

export class SyncFavoriteDto extends AddFavoriteDto {
  @ApiProperty({ description: 'Client-side timestamp' })
  declare clientTimestamp: number;
}

export class SyncTemplatesRequestDto {
  @ApiProperty({
    type: [SyncCollectionDto],
    description: 'Collections to sync',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCollectionDto)
  collections: SyncCollectionDto[];

  @ApiProperty({ type: [SyncFavoriteDto], description: 'Favorites to sync' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncFavoriteDto)
  favorites: SyncFavoriteDto[];

  @ApiProperty({ description: 'Last sync timestamp' })
  @IsNumber()
  lastSyncTimestamp: number;
}

export class CustomTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientTimestamp: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CollectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  templateIds: string[];

  @ApiProperty({ type: [CustomTemplateResponseDto] })
  customTemplates: CustomTemplateResponseDto[];

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  clientTimestamp: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SyncTemplatesResponseDto {
  @ApiProperty({ type: [CollectionResponseDto] })
  collections: CollectionResponseDto[];

  @ApiProperty({
    type: [SyncFavoriteDto],
    description: 'Favorite templates with timestamps',
  })
  favorites: SyncFavoriteDto[];

  @ApiProperty()
  syncedAt: number;
}
