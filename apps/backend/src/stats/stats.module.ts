import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Diagram } from '../diagrams/entities/diagram.entity';
import { TemplateCollection } from '../templates/entities/template-collection.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Diagram, TemplateCollection])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
