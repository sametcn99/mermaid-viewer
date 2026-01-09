import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { GenerateDiagramDto } from './dto/generate-diagram.dto';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async generateDiagram(dto: GenerateDiagramDto) {
    const {
      message,
      currentDiagramCode,
      chatHistory,
      userApiKey,
      selectedModel,
    } = dto;

    if (!message) {
      throw new BadRequestException('Message is required');
    }

    // Use user API key if provided, otherwise use server API key
    const apiKey =
      userApiKey || this.configService.get<string>('GEMINI_API_KEY');

    // Use selected model or default to gemini-2.5-flash
    const model = selectedModel || 'gemini-2.5-flash';

    if (!apiKey) {
      throw new UnauthorizedException({
        message: 'API key is required. Please provide your own Gemini API key.',
        needsApiKey: true,
      });
    }

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenAI({ apiKey });

      // Build context-aware prompt
      const systemPrompt = `You are an expert in Mermaid diagram syntax. Your role is to help users create and modify Mermaid diagrams.

Rules:
1. Always respond with valid Mermaid syntax
2. Wrap your Mermaid code in markdown code blocks with 'mermaid' language identifier
3. Provide brief explanations before or after the code
4. When modifying existing diagrams, preserve the structure and only make requested changes
5. Support all Mermaid diagram types: flowchart, sequence, class, state, ER, gantt, pie, git graph, mindmap, timeline, etc.

Current diagram code:
${currentDiagramCode ? `\`\`\`mermaid\n${currentDiagramCode}\n\`\`\`` : 'No diagram loaded'}

User request: ${message}`;

      // Build chat history for context
      const contents = chatHistory?.length
        ? [
            ...chatHistory.map((msg: { role: string; content: string }) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            })),
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
          ]
        : systemPrompt;

      // Send message and get response
      const response = await genAI.models.generateContent({
        model,
        contents,
      });

      const responseText = response.text;

      // Extract mermaid code from response
      const mermaidCodeMatch = responseText?.match(
        /```mermaid\n([\s\S]*?)\n```/,
      );
      const mermaidCode = mermaidCodeMatch ? mermaidCodeMatch[1] : null;

      return {
        response: responseText || '',
        mermaidCode,
        success: true,
      };
    } catch (error: unknown) {
      console.error('Gemini API error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Check if it's an API key error
      if (
        errorMessage.includes('API_KEY_INVALID') ||
        errorMessage.includes('API key')
      ) {
        throw new UnauthorizedException({
          message: 'Invalid API key. Please check your Gemini API key.',
          needsApiKey: true,
        });
      }

      if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        // We can throw specific exception or handle it
        throw new Error(
          'API quota exceeded. Please use your own API key to continue.',
        ); // Ideally throw HttpException with 429 status but NestJS generic 429 needs implementation or Throttler
      }

      throw new InternalServerErrorException(
        errorMessage || 'Failed to generate response',
      );
    }
  }
}
