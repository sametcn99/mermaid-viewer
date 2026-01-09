import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagramsService } from './diagrams.service';
import { DiagramsController } from './diagrams.controller';
import { Diagram } from './entities/diagram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diagram])],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
