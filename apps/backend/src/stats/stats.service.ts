import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Diagram } from '../diagrams/entities/diagram.entity';
import { TemplateCollection } from '../templates/entities/template-collection.entity';
import { StatsResponseDto } from './dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Diagram)
    private readonly diagramRepository: Repository<Diagram>,
    @InjectRepository(TemplateCollection)
    private readonly collectionRepository: Repository<TemplateCollection>,
  ) {}

  async getStats(): Promise<StatsResponseDto> {
    const [usersCount, diagramsCount, templateCollectionsCount] =
      await Promise.all([
        this.userRepository.count(),
        this.diagramRepository.count(),
        this.collectionRepository.count(),
      ]);

    return {
      usersCount,
      diagramsCount,
      templateCollectionsCount,
    };
  }
}
