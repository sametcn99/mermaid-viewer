import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mermaid diagram code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Client-side ID' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class CreateCollectionDto {
  @ApiProperty({ description: 'Collection name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Built-in template IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  templateIds?: string[];

  @ApiPropertyOptional({
    description: 'Custom templates',
    type: [CreateCustomTemplateDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomTemplateDto)
  @IsOptional()
  customTemplates?: CreateCustomTemplateDto[];

  @ApiPropertyOptional({ description: 'Client-side ID' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class UpdateCollectionDto {
  @ApiPropertyOptional({ description: 'Collection name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Built-in template IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  templateIds?: string[];

  @ApiPropertyOptional({ description: 'Client-side timestamp' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}

export class AddTemplateToCollectionDto {
  @ApiProperty({ description: 'Built-in template ID to add' })
  @IsString()
  templateId: string;
}

export class AddCustomTemplateDto extends CreateCustomTemplateDto {}

export class UpdateCustomTemplateDto {
  @ApiPropertyOptional({ description: 'Template name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Mermaid diagram code' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Client-side timestamp' })
  @IsNumber()
  @IsOptional()
  clientTimestamp?: number;
}
