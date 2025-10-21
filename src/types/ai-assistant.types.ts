export interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	diagramCode?: string;
	timestamp: number;
}

export interface ChatHistory {
	messages: ChatMessage[];
	lastUpdated: number;
}

export interface DiagramSnapshot {
	code: string;
	timestamp: number;
	messageId: string;
}

export interface AiAssistantConfig {
	consentGiven: boolean;
	userApiKey?: string;
	selectedModel?: string;
	lastConsentDate?: number;
}
