import { IsArray, IsOptional, IsString } from 'class-validator';

export class GenerateDiagramDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  currentDiagramCode?: string;

  @IsOptional()
  @IsArray()
  chatHistory?: Array<{ role: string; content: string }>;

  @IsOptional()
  @IsString()
  userApiKey?: string;

  @IsOptional()
  @IsString()
  selectedModel?: string;
}
