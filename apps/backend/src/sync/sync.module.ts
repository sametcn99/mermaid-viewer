import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { DiagramsModule } from '../diagrams';
import { TemplatesModule } from '../templates';
import { SettingsModule } from '../settings';

@Module({
  imports: [DiagramsModule, TemplatesModule, SettingsModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
