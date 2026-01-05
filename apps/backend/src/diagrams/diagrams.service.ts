import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<Diagram> {
    const diagram = this.diagramRepository.create({
      ...createDiagramDto,
      userId,
    });
    return this.diagramRepository.save(diagram);
  }

  async findAllByUser(userId: string): Promise<Diagram[]> {
    return this.diagramRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Diagram> {
    const diagram = await this.diagramRepository.findOne({
      where: { id, userId },
    });

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    return diagram;
  }

  async update(
    userId: string,
    id: string,
    updateDiagramDto: UpdateDiagramDto,
  ): Promise<Diagram> {
    const diagram = await this.findOne(userId, id);
    Object.assign(diagram, updateDiagramDto);
    return this.diagramRepository.save(diagram);
  }

  async remove(userId: string, id: string): Promise<void> {
    const diagram = await this.findOne(userId, id);
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
          existing.code = clientDiagram.code;
          existing.clientTimestamp = clientDiagram.clientTimestamp;
          await this.diagramRepository.save(existing);
        }
      } else {
        // Create new diagram
        const newDiagram = this.diagramRepository.create({
          userId,
          name: clientDiagram.name,
          code: clientDiagram.code,
          clientId: clientDiagram.clientId,
          clientTimestamp: clientDiagram.clientTimestamp,
        });
        await this.diagramRepository.save(newDiagram);
      }
    }

    // Return all diagrams
    const allDiagrams = await this.findAllByUser(userId);

    return {
      diagrams: allDiagrams.map(this.toResponseDto),
      syncedAt: Date.now(),
    };
  }

  async bulkUpsert(
    userId: string,
    diagrams: CreateDiagramDto[],
  ): Promise<Diagram[]> {
    const results: Diagram[] = [];

    for (const diagramDto of diagrams) {
      let existing: Diagram | null = null;

      if (diagramDto.clientId) {
        existing = await this.diagramRepository.findOne({
          where: { userId, clientId: diagramDto.clientId },
        });
      }

      if (existing) {
        Object.assign(existing, diagramDto);
        results.push(await this.diagramRepository.save(existing));
      } else {
        const newDiagram = this.diagramRepository.create({
          ...diagramDto,
          userId,
        });
        results.push(await this.diagramRepository.save(newDiagram));
      }
    }

    return results;
  }

  private toResponseDto(diagram: Diagram): DiagramResponseDto {
    return {
      id: diagram.id,
      name: diagram.name,
      code: diagram.code,
      clientId: diagram.clientId,
      clientTimestamp: diagram.clientTimestamp,
      createdAt: diagram.createdAt,
      updatedAt: diagram.updatedAt,
    };
  }
}
