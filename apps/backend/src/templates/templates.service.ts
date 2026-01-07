import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decryptContent, encryptContent } from '../common/crypto.util';
import {
  TemplateCollection,
  CustomTemplate,
  FavoriteTemplate,
} from './entities';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddCustomTemplateDto,
  UpdateCustomTemplateDto,
  AddFavoriteDto,
  SyncTemplatesRequestDto,
  SyncTemplatesResponseDto,
  CollectionResponseDto,
  CustomTemplateResponseDto,
} from './dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateCollection)
    private readonly collectionRepository: Repository<TemplateCollection>,
    @InjectRepository(CustomTemplate)
    private readonly customTemplateRepository: Repository<CustomTemplate>,
    @InjectRepository(FavoriteTemplate)
    private readonly favoriteRepository: Repository<FavoriteTemplate>,
  ) {}

  // Collections
  async createCollection(
    userId: string,
    dto: CreateCollectionDto,
  ): Promise<CollectionResponseDto> {
    const collection = this.collectionRepository.create({
      userId,
      name: dto.name,
      templateIds: dto.templateIds || [],
      clientId: dto.clientId,
      clientTimestamp: dto.clientTimestamp,
    });

    const saved = await this.collectionRepository.save(collection);

    if (dto.customTemplates && dto.customTemplates.length > 0) {
      const customTemplates = dto.customTemplates.map((ct) =>
        this.customTemplateRepository.create({
          collectionId: saved.id,
          name: ct.name,
          code: encryptContent(ct.code),
          clientId: ct.clientId,
          clientTimestamp: ct.clientTimestamp,
        }),
      );
      await this.customTemplateRepository.save(customTemplates);
    }

    return this.toCollectionResponseDto(
      await this.findCollectionEntity(userId, saved.id),
    );
  }

  async findAllCollections(userId: string): Promise<CollectionResponseDto[]> {
    const collections = await this.collectionRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      relations: ['customTemplates'],
    });

    return collections.map((collection) =>
      this.toCollectionResponseDto(collection),
    );
  }

  async findCollectionById(
    userId: string,
    id: string,
  ): Promise<CollectionResponseDto> {
    const collection = await this.findCollectionEntity(userId, id);
    return this.toCollectionResponseDto(collection);
  }

  async updateCollection(
    userId: string,
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<CollectionResponseDto> {
    const collection = await this.findCollectionEntity(userId, id);
    Object.assign(collection, dto);
    await this.collectionRepository.save(collection);
    return this.toCollectionResponseDto(
      await this.findCollectionEntity(userId, id),
    );
  }

  async deleteCollection(userId: string, id: string): Promise<void> {
    const collection = await this.findCollectionEntity(userId, id);
    await this.collectionRepository.remove(collection);
  }

  async addTemplateToCollection(
    userId: string,
    collectionId: string,
    templateId: string,
  ): Promise<CollectionResponseDto> {
    const collection = await this.findCollectionEntity(userId, collectionId);
    if (!collection.templateIds.includes(templateId)) {
      collection.templateIds.push(templateId);
      await this.collectionRepository.save(collection);
    }
    return this.toCollectionResponseDto(
      await this.findCollectionEntity(userId, collectionId),
    );
  }

  async removeTemplateFromCollection(
    userId: string,
    collectionId: string,
    templateId: string,
  ): Promise<CollectionResponseDto> {
    const collection = await this.findCollectionEntity(userId, collectionId);
    collection.templateIds = collection.templateIds.filter(
      (id) => id !== templateId,
    );
    await this.collectionRepository.save(collection);
    return this.toCollectionResponseDto(
      await this.findCollectionEntity(userId, collectionId),
    );
  }

  // Custom Templates
  async addCustomTemplate(
    userId: string,
    collectionId: string,
    dto: AddCustomTemplateDto,
  ): Promise<CustomTemplateResponseDto> {
    await this.findCollectionEntity(userId, collectionId);

    const customTemplate = this.customTemplateRepository.create({
      collectionId,
      name: dto.name,
      code: encryptContent(dto.code),
      clientId: dto.clientId,
      clientTimestamp: dto.clientTimestamp,
    });

    const saved = await this.customTemplateRepository.save(customTemplate);
    return this.toCustomTemplateResponseDto(saved);
  }

  async updateCustomTemplate(
    userId: string,
    collectionId: string,
    templateId: string,
    dto: UpdateCustomTemplateDto,
  ): Promise<CustomTemplateResponseDto> {
    await this.findCollectionEntity(userId, collectionId);

    const template = await this.customTemplateRepository.findOne({
      where: { id: templateId, collectionId },
    });

    if (!template) {
      throw new NotFoundException('Custom template not found');
    }

    Object.assign(template, {
      ...dto,
      code: encryptContent(dto.code) ?? template.code,
    });
    const saved = await this.customTemplateRepository.save(template);
    return this.toCustomTemplateResponseDto(saved);
  }

  async removeCustomTemplate(
    userId: string,
    collectionId: string,
    templateId: string,
  ): Promise<void> {
    await this.findCollectionEntity(userId, collectionId);

    const template = await this.customTemplateRepository.findOne({
      where: { id: templateId, collectionId },
    });

    if (!template) {
      throw new NotFoundException('Custom template not found');
    }

    await this.customTemplateRepository.remove(template);
  }

  // Favorites
  async addFavorite(
    userId: string,
    dto: AddFavoriteDto,
  ): Promise<FavoriteTemplate> {
    const existing = await this.favoriteRepository.findOne({
      where: { userId, templateId: dto.templateId },
    });

    if (existing) {
      return existing;
    }

    const favorite = this.favoriteRepository.create({
      userId,
      templateId: dto.templateId,
      clientTimestamp: dto.clientTimestamp,
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, templateId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, templateId },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }

  async findAllFavorites(userId: string): Promise<FavoriteTemplate[]> {
    return this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async isFavorite(userId: string, templateId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, templateId },
    });
    return !!favorite;
  }

  // Sync
  async sync(
    userId: string,
    syncRequest: SyncTemplatesRequestDto,
  ): Promise<SyncTemplatesResponseDto> {
    // Sync collections
    const existingCollections = await this.collectionRepository.find({
      where: { userId },
      relations: ['customTemplates'],
    });

    const existingByClientId = new Map<string, TemplateCollection>();
    for (const collection of existingCollections) {
      if (collection.clientId) {
        existingByClientId.set(collection.clientId, collection);
      }
    }

    for (const clientCollection of syncRequest.collections) {
      const existing = existingByClientId.get(clientCollection.clientId);

      if (existing) {
        if (
          clientCollection.clientTimestamp > (existing.clientTimestamp || 0)
        ) {
          existing.name = clientCollection.name;
          existing.templateIds = clientCollection.templateIds || [];
          existing.clientTimestamp = clientCollection.clientTimestamp;
          await this.collectionRepository.save(existing);

          // Sync custom templates
          if (clientCollection.customTemplates) {
            const existingCustomByClientId = new Map<string, CustomTemplate>();
            for (const ct of existing.customTemplates || []) {
              if (ct.clientId) {
                existingCustomByClientId.set(ct.clientId, ct);
              }
            }

            for (const clientCt of clientCollection.customTemplates) {
              const existingCt = clientCt.clientId
                ? existingCustomByClientId.get(clientCt.clientId)
                : null;

              if (existingCt) {
                if (
                  (clientCt.clientTimestamp || 0) >
                  (existingCt.clientTimestamp || 0)
                ) {
                  existingCt.name = clientCt.name;
                  existingCt.code =
                    encryptContent(clientCt.code) ?? existingCt.code;
                  existingCt.clientTimestamp =
                    clientCt.clientTimestamp || Date.now();
                  await this.customTemplateRepository.save(existingCt);
                }
              } else {
                const newCt = this.customTemplateRepository.create({
                  collectionId: existing.id,
                  name: clientCt.name,
                  code: encryptContent(clientCt.code),
                  clientId: clientCt.clientId,
                  clientTimestamp: clientCt.clientTimestamp || Date.now(),
                });
                await this.customTemplateRepository.save(newCt);
              }
            }
          }
        }
      } else {
        await this.createCollection(userId, clientCollection);
      }
    }

    // Sync favorites
    const existingFavorites = await this.favoriteRepository.find({
      where: { userId },
    });

    const existingFavIds = new Set(existingFavorites.map((f) => f.templateId));

    for (const clientFav of syncRequest.favorites) {
      if (!existingFavIds.has(clientFav.templateId)) {
        await this.addFavorite(userId, clientFav);
      }
    }

    // Return all data
    const allCollections = await this.findAllCollections(userId);
    const allFavorites = await this.findAllFavorites(userId);

    return {
      collections: allCollections,
      favorites: allFavorites.map((f) => ({
        templateId: f.templateId,
        clientTimestamp: Number(
          f.clientTimestamp ?? f.createdAt?.getTime() ?? Date.now(),
        ),
      })),
      syncedAt: Date.now(),
    };
  }

  private toCollectionResponseDto(
    collection: TemplateCollection,
  ): CollectionResponseDto {
    return {
      id: collection.id,
      name: collection.name,
      templateIds: collection.templateIds,
      customTemplates: (collection.customTemplates || []).map((ct) =>
        this.toCustomTemplateResponseDto(ct),
      ),
      clientId: collection.clientId,
      clientTimestamp: collection.clientTimestamp,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  }

  private toCustomTemplateResponseDto(
    template: CustomTemplate,
  ): CustomTemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      code: this.decryptCode(template.code),
      clientId: template.clientId,
      clientTimestamp: template.clientTimestamp,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  private decryptCode(value?: string | null): string {
    if (value === undefined || value === null) {
      return '';
    }

    try {
      return decryptContent(value) ?? '';
    } catch (_) {
      return value;
    }
  }

  private async findCollectionEntity(
    userId: string,
    id: string,
  ): Promise<TemplateCollection> {
    const collection = await this.collectionRepository.findOne({
      where: { id, userId },
      relations: ['customTemplates'],
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }
}
