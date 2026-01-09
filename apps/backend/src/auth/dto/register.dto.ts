import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Jane Doe',
    description: 'Display name to show in the application',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  displayName?: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 8 characters)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
