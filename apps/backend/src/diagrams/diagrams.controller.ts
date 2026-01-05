import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DiagramsService } from './diagrams.service';
import {
  CreateDiagramDto,
  UpdateDiagramDto,
  SyncDiagramsRequestDto,
  SyncDiagramsResponseDto,
  DiagramResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('diagrams')
@ApiBearerAuth()
@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diagram' })
  @ApiResponse({
    status: 201,
    description: 'Diagram created',
    type: DiagramResponseDto,
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createDiagramDto: CreateDiagramDto,
  ) {
    return this.diagramsService.create(userId, createDiagramDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all diagrams for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of diagrams',
    type: [DiagramResponseDto],
  })
  async findAll(@CurrentUser('id') userId: string) {
    return this.diagramsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific diagram' })
  @ApiResponse({
    status: 200,
    description: 'Diagram found',
    type: DiagramResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Diagram not found' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.diagramsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a diagram' })
  @ApiResponse({
    status: 200,
    description: 'Diagram updated',
    type: DiagramResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Diagram not found' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateDiagramDto: UpdateDiagramDto,
  ) {
    return this.diagramsService.update(userId, id, updateDiagramDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a diagram' })
  @ApiResponse({ status: 204, description: 'Diagram deleted' })
  @ApiResponse({ status: 404, description: 'Diagram not found' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.diagramsService.remove(userId, id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync diagrams with client' })
  @ApiResponse({
    status: 200,
    description: 'Diagrams synced',
    type: SyncDiagramsResponseDto,
  })
  async sync(
    @CurrentUser('id') userId: string,
    @Body() syncRequest: SyncDiagramsRequestDto,
  ): Promise<SyncDiagramsResponseDto> {
    return this.diagramsService.sync(userId, syncRequest);
  }
}
