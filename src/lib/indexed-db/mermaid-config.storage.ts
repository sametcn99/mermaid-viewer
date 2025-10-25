import { STORE_NAMES, withDatabase } from ".";

const MERMAID_CONFIG_STORE = STORE_NAMES.MERMAID_CONFIG;
const MERMAID_CONFIG_ID = "global";

type StoredMermaidConfig = {
	id: string;
	config: unknown;
	updatedAt: number;
};

/**
 * Save Mermaid config to local storage
 *
 * @param config The Mermaid configuration to save
 */
export async function saveMermaidConfig(config: unknown): Promise<void> {
	try {
		const record: StoredMermaidConfig = {
			id: MERMAID_CONFIG_ID,
			config,
			updatedAt: Date.now(),
		};
		await withDatabase((db) => db.put(MERMAID_CONFIG_STORE, record));
	} catch (error) {
		// Silently skip during SSR or when IndexedDB is not available
		if (
			error instanceof Error &&
			error.message.includes("IndexedDB is not supported")
		) {
			return;
		}
		console.error("Failed to save Mermaid config:", error);
	}
}

/**
 * Get Mermaid config from local storage
 *
 * @returns The saved Mermaid configuration or null if not found
 */
export async function getMermaidConfig(): Promise<unknown | null> {
	try {
		const record = await withDatabase((db) =>
			db.get(MERMAID_CONFIG_STORE, MERMAID_CONFIG_ID),
		);
		return record?.config ?? null;
	} catch (error) {
		// Silently return null during SSR or when IndexedDB is not available
		if (
			error instanceof Error &&
			error.message.includes("IndexedDB is not supported")
		) {
			return null;
		}
		console.error("Failed to parse Mermaid config:", error);
		return null;
	}
}
