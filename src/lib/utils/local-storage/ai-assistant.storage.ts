import { compressToBase64, decompressFromBase64 } from "../compression.utils";
import type {
	AiAssistantConfig,
	ChatHistory,
	ChatMessage,
	DiagramSnapshot,
} from "@/types/ai-assistant.types";

const AI_CHAT_HISTORY_KEY = "mermaid-viewer-ai-chat-history";
const AI_ASSISTANT_CONFIG_KEY = "mermaid-viewer-ai-config";
const AI_DIAGRAM_SNAPSHOTS_KEY = "mermaid-viewer-ai-snapshots";

function persistCompressedData(key: string, payload: string): void {
	if (typeof window === "undefined") return;
	try {
		const base64Data = compressToBase64(payload);
		localStorage.setItem(key, base64Data);
	} catch (error) {
		console.error(`Failed to persist ${key} with compression:`, error);
		localStorage.setItem(key, payload);
	}
}

function parseCompressedData<T>(key: string): T | null {
	if (typeof window === "undefined") return null;
	const storedData = localStorage.getItem(key);
	if (!storedData) return null;

	try {
		const decompressed = decompressFromBase64(storedData);
		return JSON.parse(decompressed) as T;
	} catch (error) {
		console.warn(
			`Failed to parse compressed ${key.replace("mermaid-viewer-", "")} data, attempting fallback:`,
			error,
		);
		try {
			return JSON.parse(storedData) as T;
		} catch (fallbackError) {
			console.error(`Failed to parse ${key} data:`, fallbackError);
			return null;
		}
	}
}

/**
 * Save AI chat history to local storage
 *
 * @param history The chat history to save
 */
export function saveAiChatHistory(history: ChatHistory): void {
	const payload = JSON.stringify(history);
	persistCompressedData(AI_CHAT_HISTORY_KEY, payload);
}

/**
 * Get AI chat history from local storage
 *
 * @returns The chat history or null if not found
 */
export function getAiChatHistory(): ChatHistory | null {
	return parseCompressedData<ChatHistory>(AI_CHAT_HISTORY_KEY);
}

/**
 * Clear AI chat history from local storage
 */
export function clearAiChatHistory(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(AI_CHAT_HISTORY_KEY);
}

/**
 * Add a message to AI chat history
 *
 * @param message The message to add
 */
export function addMessageToAiChatHistory(message: ChatMessage): void {
	const history = getAiChatHistory() || {
		messages: [],
		lastUpdated: Date.now(),
	};
	history.messages.push(message);
	history.lastUpdated = Date.now();
	saveAiChatHistory(history);
}

/**
 * Save AI assistant configuration
 *
 * @param config The configuration to save
 */
export function saveAiAssistantConfig(config: AiAssistantConfig): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(AI_ASSISTANT_CONFIG_KEY, JSON.stringify(config));
	} catch (error) {
		console.error("Failed to save AI assistant config:", error);
	}
}

/**
 * Get AI assistant configuration
 *
 * @returns The configuration or null if not found
 */
export function getAiAssistantConfig(): AiAssistantConfig | null {
	if (typeof window === "undefined") return null;
	try {
		const storedConfig = localStorage.getItem(AI_ASSISTANT_CONFIG_KEY);
		if (!storedConfig) return null;
		return JSON.parse(storedConfig);
	} catch (error) {
		console.error("Failed to parse AI assistant config:", error);
		return null;
	}
}

/**
 * Save diagram snapshots for version history
 *
 * @param snapshots The snapshots to save
 */
export function saveDiagramSnapshots(snapshots: DiagramSnapshot[]): void {
	const payload = JSON.stringify(snapshots);
	persistCompressedData(AI_DIAGRAM_SNAPSHOTS_KEY, payload);
}

/**
 * Get diagram snapshots from local storage
 *
 * @returns Array of diagram snapshots
 */
export function getDiagramSnapshots(): DiagramSnapshot[] {
	const snapshots = parseCompressedData<DiagramSnapshot[]>(
		AI_DIAGRAM_SNAPSHOTS_KEY,
	);
	return snapshots ?? [];
}

/**
 * Clear diagram snapshots from local storage
 */
export function clearDiagramSnapshots(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(AI_DIAGRAM_SNAPSHOTS_KEY);
}
