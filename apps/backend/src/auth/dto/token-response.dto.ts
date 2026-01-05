import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'JWT access token (expires in 15 minutes)' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token (expires in 7 days)' })
  refreshToken: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Display name shown in the app' })
  displayName: string | null;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class AuthResponseDto extends TokenResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
