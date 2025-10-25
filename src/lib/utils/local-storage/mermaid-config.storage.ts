const MERMAID_CONFIG_KEY = "mermaid-viewer-config";

/**
 * Save Mermaid config to local storage
 *
 * @param config The Mermaid configuration to save
 */
export function saveMermaidConfig(config: unknown): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(MERMAID_CONFIG_KEY, JSON.stringify(config));
	} catch (error) {
		console.error("Failed to save Mermaid config:", error);
	}
}

/**
 * Get Mermaid config from local storage
 *
 * @returns The saved Mermaid configuration or null if not found
 */
export function getMermaidConfig(): unknown | null {
	if (typeof window === "undefined") return null;
	try {
		const storedConfig = localStorage.getItem(MERMAID_CONFIG_KEY);
		if (!storedConfig) return null;
		return JSON.parse(storedConfig);
	} catch (error) {
		console.error("Failed to parse Mermaid config:", error);
		return null;
	}
}
