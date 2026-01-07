import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty({ description: 'Total number of registered users' })
  usersCount: number;

  @ApiProperty({ description: 'Total number of mermaid diagrams created' })
  diagramsCount: number;

  @ApiProperty({ description: 'Total number of template collections created' })
  templateCollectionsCount: number;
}
