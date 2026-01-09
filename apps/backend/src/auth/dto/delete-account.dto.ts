import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeleteAccountDto {
  @ApiPropertyOptional({
    example: 'password123',
    description: 'User password (required for password-based accounts)',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
