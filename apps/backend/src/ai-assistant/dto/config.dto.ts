import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAiConfigDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  consentGiven?: boolean;

  @ApiPropertyOptional({ description: 'User API key (will be encrypted)' })
  @IsString()
  @IsOptional()
  userApiKey?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  selectedModel?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lastConsentDate?: number;
}

export class AiConfigResponseDto {
  @ApiProperty()
  consentGiven: boolean;

  @ApiPropertyOptional({ description: 'Redacted API key value if stored' })
  userApiKey?: string;

  @ApiPropertyOptional()
  selectedModel?: string;

  @ApiPropertyOptional()
  lastConsentDate?: number;

  @ApiPropertyOptional({ description: 'Last update timestamp in ms' })
  updatedAt?: number;
}
