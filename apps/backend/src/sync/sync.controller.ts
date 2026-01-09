import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { FullSyncRequestDto, FullSyncResponseDto } from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('sync')
@ApiBearerAuth()
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('full')
  @ApiOperation({
    summary: 'Full sync all user data',
    description: `
      Performs a complete sync of all user data between client and server.
      
      **First Login Flow (lastSyncTimestamp = 0):**
      - Client sends all local IndexedDB data
      - Server merges with any existing data (based on timestamps)
      - Server returns complete merged dataset
      
      **Subsequent Logins:**
      - Client sends local changes since last sync
      - Server merges based on timestamps (newer wins)
      - Server returns complete current dataset
      
      The client should replace its IndexedDB with the returned data.
    `,
  })
  @ApiResponse({ status: 200, type: FullSyncResponseDto })
  async fullSync(
    @CurrentUser('id') userId: string,
    @Body() syncRequest: FullSyncRequestDto,
  ): Promise<FullSyncResponseDto> {
    return this.syncService.fullSync(userId, syncRequest);
  }
}
