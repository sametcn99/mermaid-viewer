import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAssistantService } from './ai-assistant.service';
import { AiAssistantController } from './ai-assistant.controller';
import { ChatMessage, DiagramSnapshot, AiConfig } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, DiagramSnapshot, AiConfig])],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
