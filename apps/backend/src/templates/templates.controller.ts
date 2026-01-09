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
import { TemplatesService } from './templates.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddTemplateToCollectionDto,
  AddCustomTemplateDto,
  UpdateCustomTemplateDto,
  AddFavoriteDto,
  SyncTemplatesRequestDto,
  SyncTemplatesResponseDto,
  CollectionResponseDto,
  FavoriteResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('templates')
@ApiBearerAuth()
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  // Collections
  @Post('collections')
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({ status: 201, type: CollectionResponseDto })
  async createCollection(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCollectionDto,
  ) {
    return this.templatesService.createCollection(userId, dto);
  }

  @Get('collections')
  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, type: [CollectionResponseDto] })
  async findAllCollections(@CurrentUser('id') userId: string) {
    return this.templatesService.findAllCollections(userId);
  }

  @Get('collections/:id')
  @ApiOperation({ summary: 'Get a collection by ID' })
  @ApiResponse({ status: 200, type: CollectionResponseDto })
  async findCollection(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.templatesService.findCollectionById(userId, id);
  }

  @Patch('collections/:id')
  @ApiOperation({ summary: 'Update a collection' })
  @ApiResponse({ status: 200, type: CollectionResponseDto })
  async updateCollection(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.templatesService.updateCollection(userId, id, dto);
  }

  @Delete('collections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a collection' })
  async deleteCollection(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.templatesService.deleteCollection(userId, id);
  }

  @Post('collections/:id/templates')
  @ApiOperation({ summary: 'Add a built-in template to collection' })
  @ApiResponse({ status: 200, type: CollectionResponseDto })
  async addTemplateToCollection(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: AddTemplateToCollectionDto,
  ) {
    return this.templatesService.addTemplateToCollection(
      userId,
      id,
      dto.templateId,
    );
  }

  @Delete('collections/:id/templates/:templateId')
  @ApiOperation({ summary: 'Remove a built-in template from collection' })
  @ApiResponse({ status: 200, type: CollectionResponseDto })
  async removeTemplateFromCollection(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.removeTemplateFromCollection(
      userId,
      id,
      templateId,
    );
  }

  // Custom Templates
  @Post('collections/:id/custom')
  @ApiOperation({ summary: 'Add a custom template to collection' })
  async addCustomTemplate(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: AddCustomTemplateDto,
  ) {
    return this.templatesService.addCustomTemplate(userId, id, dto);
  }

  @Patch('collections/:collectionId/custom/:templateId')
  @ApiOperation({ summary: 'Update a custom template' })
  async updateCustomTemplate(
    @CurrentUser('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Param('templateId') templateId: string,
    @Body() dto: UpdateCustomTemplateDto,
  ) {
    return this.templatesService.updateCustomTemplate(
      userId,
      collectionId,
      templateId,
      dto,
    );
  }

  @Delete('collections/:collectionId/custom/:templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a custom template' })
  async removeCustomTemplate(
    @CurrentUser('id') userId: string,
    @Param('collectionId') collectionId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.removeCustomTemplate(
      userId,
      collectionId,
      templateId,
    );
  }

  // Favorites
  @Post('favorites')
  @ApiOperation({ summary: 'Add a template to favorites' })
  @ApiResponse({ status: 201, type: FavoriteResponseDto })
  async addFavorite(
    @CurrentUser('id') userId: string,
    @Body() dto: AddFavoriteDto,
  ) {
    return this.templatesService.addFavorite(userId, dto);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({ status: 200, type: [FavoriteResponseDto] })
  async findAllFavorites(@CurrentUser('id') userId: string) {
    return this.templatesService.findAllFavorites(userId);
  }

  @Delete('favorites/:templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a template from favorites' })
  async removeFavorite(
    @CurrentUser('id') userId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.removeFavorite(userId, templateId);
  }

  @Get('favorites/:templateId/check')
  @ApiOperation({ summary: 'Check if template is favorite' })
  @ApiResponse({
    status: 200,
    schema: { type: 'object', properties: { isFavorite: { type: 'boolean' } } },
  })
  async isFavorite(
    @CurrentUser('id') userId: string,
    @Param('templateId') templateId: string,
  ) {
    return {
      isFavorite: await this.templatesService.isFavorite(userId, templateId),
    };
  }

  // Sync
  @Post('sync')
  @ApiOperation({ summary: 'Sync templates with client' })
  @ApiResponse({ status: 200, type: SyncTemplatesResponseDto })
  async sync(
    @CurrentUser('id') userId: string,
    @Body() syncRequest: SyncTemplatesRequestDto,
  ): Promise<SyncTemplatesResponseDto> {
    return this.templatesService.sync(userId, syncRequest);
  }
}
