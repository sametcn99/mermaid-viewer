import { STORE_NAMES, withDatabase } from ".";
import type {
	AiAssistantConfig,
	ChatHistory,
	ChatMessage,
	DiagramSnapshot,
} from "@/types/ai-assistant.types";

const AI_CHAT_HISTORY_STORE = STORE_NAMES.AI_CHAT_HISTORY;
const AI_ASSISTANT_CONFIG_STORE = STORE_NAMES.AI_ASSISTANT_CONFIG;
const AI_SNAPSHOT_STORE = STORE_NAMES.AI_DIAGRAM_SNAPSHOTS;

const AI_CHAT_HISTORY_ID = "default";
const AI_ASSISTANT_CONFIG_ID = "default";

type StoredChatHistory = ChatHistory & { id: string };
type StoredAssistantConfig = {
	id: string;
	config: AiAssistantConfig;
	updatedAt: number;
};

/**
 * Save AI chat history to local storage
 *
 * @param history The chat history to save
 */

export async function saveAiChatHistory(history: ChatHistory): Promise<void> {
	const record: StoredChatHistory = {
		id: AI_CHAT_HISTORY_ID,
		...history,
		lastUpdated: history.lastUpdated ?? Date.now(),
	};
	await withDatabase((db) => db.put(AI_CHAT_HISTORY_STORE, record));
}

/**
 * Get AI chat history from local storage
 *
 * @returns The chat history or null if not found
 */
export async function getAiChatHistory(): Promise<ChatHistory | null> {
	const record = await withDatabase((db) =>
		db.get(AI_CHAT_HISTORY_STORE, AI_CHAT_HISTORY_ID),
	);
	if (!record) return null;
	const { id: _id, ...history } = record;
	return history as ChatHistory;
}

/**
 * Clear AI chat history from local storage
 */
export async function clearAiChatHistory(): Promise<void> {
	await withDatabase((db) =>
		db.delete(AI_CHAT_HISTORY_STORE, AI_CHAT_HISTORY_ID),
	);
}

/**
 * Add a message to AI chat history
 *
 * @param message The message to add
 */
export async function addMessageToAiChatHistory(
	message: ChatMessage,
): Promise<void> {
	const history = (await getAiChatHistory()) ?? {
		messages: [],
		lastUpdated: Date.now(),
	};
	history.messages.push(message);
	history.lastUpdated = Date.now();
	await saveAiChatHistory(history);
}

/**
 * Save AI assistant configuration
 *
 * @param config The configuration to save
 */
export async function saveAiAssistantConfig(
	config: AiAssistantConfig,
): Promise<void> {
	const record: StoredAssistantConfig = {
		id: AI_ASSISTANT_CONFIG_ID,
		config,
		updatedAt: Date.now(),
	};
	await withDatabase((db) => db.put(AI_ASSISTANT_CONFIG_STORE, record));
}

/**
 * Get AI assistant configuration
 *
 * @returns The configuration or null if not found
 */
export async function getAiAssistantConfig(): Promise<AiAssistantConfig | null> {
	const record = await withDatabase((db) =>
		db.get(AI_ASSISTANT_CONFIG_STORE, AI_ASSISTANT_CONFIG_ID),
	);
	if (!record?.config) return null;
	return record.config as AiAssistantConfig;
}

/**
 * Save diagram snapshots for version history
 *
 * @param snapshots The snapshots to save
 */
export async function saveDiagramSnapshots(
	snapshots: DiagramSnapshot[],
): Promise<void> {
	await withDatabase(async (db) => {
		const tx = db.transaction(AI_SNAPSHOT_STORE, "readwrite");
		const store = tx.store;
		await store.clear();
		for (const snapshot of snapshots) {
			await store.put(snapshot);
		}
		await tx.done;
	});
}

/**
 * Get diagram snapshots from local storage
 *
 * @returns Array of diagram snapshots
 */
export async function getDiagramSnapshots(): Promise<DiagramSnapshot[]> {
	const snapshots = await withDatabase((db) => db.getAll(AI_SNAPSHOT_STORE));
	return snapshots
		.filter((snapshot): snapshot is DiagramSnapshot => Boolean(snapshot))
		.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Clear diagram snapshots from local storage
 */
export async function clearDiagramSnapshots(): Promise<void> {
	await withDatabase((db) => db.clear(AI_SNAPSHOT_STORE));
}
