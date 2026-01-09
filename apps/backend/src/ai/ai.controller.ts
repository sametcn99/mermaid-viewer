import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateDiagramDto } from './dto/generate-diagram.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public() // Allow public access since the frontend might use it without login (based on previous route)
  @Post('generate')
  async generateDiagram(@Body() generateDiagramDto: GenerateDiagramDto) {
    return this.aiService.generateDiagram(generateDiagramDto);
  }
}
