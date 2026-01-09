import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decryptContent, encryptContent } from '../common/crypto.util';
import { Diagram } from './entities/diagram.entity';
import {
  CreateDiagramDto,
  UpdateDiagramDto,
  SyncDiagramsRequestDto,
  SyncDiagramsResponseDto,
  DiagramResponseDto,
} from './dto';

@Injectable()
export class DiagramsService {
  constructor(
    @InjectRepository(Diagram)
    private readonly diagramRepository: Repository<Diagram>,
  ) {}

  async create(
    userId: string,
    createDiagramDto: CreateDiagramDto,
  ): Promise<DiagramResponseDto> {
    const diagram = this.diagramRepository.create({
      ...createDiagramDto,
      userId,
      code: encryptContent(createDiagramDto.code),
    });
    const saved = await this.diagramRepository.save(diagram);
    return this.toResponseDto(saved);
  }

  async findAllByUser(userId: string): Promise<DiagramResponseDto[]> {
    const diagrams = await this.diagramRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    return diagrams.map((diagram) => this.toResponseDto(diagram));
  }

  async findOne(userId: string, id: string): Promise<DiagramResponseDto> {
    const diagram = await this.findDiagramEntity(userId, id);
    return this.toResponseDto(diagram);
  }

  async update(
    userId: string,
    id: string,
    updateDiagramDto: UpdateDiagramDto,
  ): Promise<DiagramResponseDto> {
    const diagram = await this.findDiagramEntity(userId, id);

    Object.assign(diagram, {
      ...updateDiagramDto,
      code: encryptContent(updateDiagramDto.code) ?? diagram.code,
    });
    const saved = await this.diagramRepository.save(diagram);
    return this.toResponseDto(saved);
  }

  async remove(userId: string, id: string): Promise<void> {
    const diagram = await this.findDiagramEntity(userId, id);
    await this.diagramRepository.remove(diagram);
  }

  async sync(
    userId: string,
    syncRequest: SyncDiagramsRequestDto,
  ): Promise<SyncDiagramsResponseDto> {
    const existingDiagrams = await this.diagramRepository.find({
      where: { userId },
    });

    const existingByClientId = new Map<string, Diagram>();
    for (const diagram of existingDiagrams) {
      if (diagram.clientId) {
        existingByClientId.set(diagram.clientId, diagram);
      }
    }

    // Process incoming diagrams
    for (const clientDiagram of syncRequest.diagrams) {
      const existing = existingByClientId.get(clientDiagram.clientId);

      if (existing) {
        // Update if client version is newer
        if (clientDiagram.clientTimestamp > (existing.clientTimestamp || 0)) {
          existing.name = clientDiagram.name;
          existing.code = encryptContent(clientDiagram.code) ?? existing.code;
          existing.settings = clientDiagram.settings ?? null;
          existing.clientTimestamp = clientDiagram.clientTimestamp;
          await this.diagramRepository.save(existing);
        }
      } else {
        // Create new diagram
        const newDiagram = this.diagramRepository.create({
          userId,
          name: clientDiagram.name,
          code: encryptContent(clientDiagram.code),
          settings: clientDiagram.settings ?? null,
          clientId: clientDiagram.clientId,
          clientTimestamp: clientDiagram.clientTimestamp,
        });
        await this.diagramRepository.save(newDiagram);
      }
    }

    // Return all diagrams
    const allDiagrams = await this.findAllByUser(userId);

    return {
      diagrams: allDiagrams,
      syncedAt: Date.now(),
    };
  }

  async bulkUpsert(
    userId: string,
    diagrams: CreateDiagramDto[],
  ): Promise<DiagramResponseDto[]> {
    const results: DiagramResponseDto[] = [];

    for (const diagramDto of diagrams) {
      let existing: Diagram | null = null;

      if (diagramDto.clientId) {
        existing = await this.diagramRepository.findOne({
          where: { userId, clientId: diagramDto.clientId },
        });
      }

      if (existing) {
        Object.assign(existing, {
          ...diagramDto,
          code: encryptContent(diagramDto.code) ?? existing.code,
        });
        const saved = await this.diagramRepository.save(existing);
        results.push(this.toResponseDto(saved));
      } else {
        const newDiagram = this.diagramRepository.create({
          ...diagramDto,
          userId,
          code: encryptContent(diagramDto.code),
        });
        const saved = await this.diagramRepository.save(newDiagram);
        results.push(this.toResponseDto(saved));
      }
    }

    return results;
  }

  private toResponseDto(diagram: Diagram): DiagramResponseDto {
    return {
      id: diagram.id,
      name: diagram.name,
      code: this.decryptCode(diagram.code),
      settings: diagram.settings ?? null,
      clientId: diagram.clientId,
      clientTimestamp: diagram.clientTimestamp,
      createdAt: diagram.createdAt,
      updatedAt: diagram.updatedAt,
    };
  }

  private decryptCode(value?: string | null): string {
    if (value === undefined || value === null) {
      return '';
    }

    try {
      return decryptContent(value) ?? '';
    } catch {
      // In case legacy plaintext is encountered, pass it through.
      return value;
    }
  }

  private async findDiagramEntity(
    userId: string,
    id: string,
  ): Promise<Diagram> {
    const diagram = await this.diagramRepository.findOne({
      where: { id, userId },
    });

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return diagram;
  }
}
