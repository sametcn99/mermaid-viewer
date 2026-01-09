export class GenerateDiagramDto {
  message: string;
  currentDiagramCode?: string;
  chatHistory?: Array<{ role: string; content: string }>;
  userApiKey?: string;
  selectedModel?: string;
}
