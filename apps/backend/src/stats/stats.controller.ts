import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { StatsService } from './stats.service';
import { StatsResponseDto } from './dto';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get application statistics' })
  getStats(): Promise<StatsResponseDto> {
    return this.statsService.getStats();
  }
}
