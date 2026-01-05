import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { DiagramsModule } from '../diagrams';
import { TemplatesModule } from '../templates';
import { AiAssistantModule } from '../ai-assistant';
import { SettingsModule } from '../settings';

@Module({
  imports: [DiagramsModule, TemplatesModule, AiAssistantModule, SettingsModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
