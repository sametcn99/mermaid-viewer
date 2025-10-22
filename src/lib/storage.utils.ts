import pako from "pako";

export interface SavedDiagram {
	id: string;
	name: string;
	code: string;
	timestamp: number;
}

const STORAGE_KEY = "mermaid-viewer-diagrams";

/**
 * Save a diagram to local storage
 *
 * @param name The name of the diagram
 * @param code The Mermaid code to save
 * @returns The saved diagram object with ID
 */
export function saveDiagramToStorage(name: string, code: string): SavedDiagram {
	const diagrams = getAllDiagramsFromStorage();

	const newDiagram: SavedDiagram = {
		id: `diagram_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
		name: name || `Untitled Diagram ${diagrams.length + 1}`,
		code,
		timestamp: Date.now(),
	};

	diagrams.push(newDiagram);
	try {
		const stringifiedData = JSON.stringify(diagrams);
		const compressedData = pako.deflate(stringifiedData);
		const base64Data = btoa(
			String.fromCharCode.apply(null, Array.from(compressedData)),
		);
		localStorage.setItem(STORAGE_KEY, base64Data);
	} catch (error) {
		console.error("Failed to save and compress diagrams:", error);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
	}

	return newDiagram;
}

/**
 * Get all saved diagrams from local storage
 *
 * @returns Array of saved diagrams
 */
export function getAllDiagramsFromStorage(): SavedDiagram[] {
	if (typeof window === "undefined") return [];
	try {
		const base64Data = localStorage.getItem(STORAGE_KEY);
		if (!base64Data) return [];
		const compressedData = new Uint8Array(
			atob(base64Data)
				.split("")
				.map((char) => char.charCodeAt(0)),
		);
		const decompressedData = pako.inflate(compressedData, { to: "string" });
		return JSON.parse(decompressedData);
	} catch (error) {
		console.warn(
			"Failed to parse compressed diagrams from local storage, attempting fallback:",
			error,
		);
		try {
			const storedData = localStorage.getItem(STORAGE_KEY);
			if (!storedData) return [];
			if (storedData.startsWith("[") || storedData.startsWith("{")) {
				return JSON.parse(storedData);
			}
			console.error("Fallback failed: Data is not valid JSON.", storedData);
			return [];
		} catch (fallbackError) {
			console.error(
				"Failed to parse diagrams from local storage (fallback JSON parse):",
				fallbackError,
			);
			return [];
		}
	}
}

/**
 * Get a specific diagram by ID
 *
 * @param id The ID of the diagram to retrieve
 * @returns The diagram if found, or undefined
 */
export function getDiagramById(id: string): SavedDiagram | undefined {
	const diagrams = getAllDiagramsFromStorage();
	return diagrams.find((diagram) => diagram.id === id);
}

/**
 * Update an existing diagram in storage
 *
 * @param id The ID of the diagram to update
 * @param updates The properties to update
 * @returns The updated diagram if found, or undefined
 */
export function updateDiagram(
	id: string,
	updates: Partial<Omit<SavedDiagram, "id">>,
): SavedDiagram | undefined {
	const diagrams = getAllDiagramsFromStorage();
	const index = diagrams.findIndex((diagram) => diagram.id === id);

	if (index === -1) return undefined;

	diagrams[index] = {
		...diagrams[index],
		...updates,
		timestamp: Date.now(),
	};

	try {
		const stringifiedData = JSON.stringify(diagrams);
		const compressedData = pako.deflate(stringifiedData);
		const base64Data = btoa(
			String.fromCharCode.apply(null, Array.from(compressedData)),
		);
		localStorage.setItem(STORAGE_KEY, base64Data);
	} catch (error) {
		console.error("Failed to update and compress diagrams:", error);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
	}
	return diagrams[index];
}

/**
 * Delete a diagram from storage
 *
 * @param id The ID of the diagram to delete
 * @returns true if deleted, false if not found
 */
export function deleteDiagram(id: string): boolean {
	const diagrams = getAllDiagramsFromStorage();
	const filteredDiagrams = diagrams.filter((diagram) => diagram.id !== id);

	if (filteredDiagrams.length === diagrams.length) {
		return false;
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDiagrams));
	return true;
}

/**
 * Check if the current code matches any saved diagram
 *
 * @param code The current code to check
 * @returns The matching diagram ID if found, or undefined
 */
export function findMatchingDiagramId(code: string): string | undefined {
	const diagrams = getAllDiagramsFromStorage();
	const match = diagrams.find((diagram) => diagram.code === code);
	return match?.id;
}

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

// Favorite Templates Storage

export interface FavoriteTemplate {
	templateId: string;
	timestamp: number;
}

export interface CustomTemplate {
	id: string;
	name: string;
	code: string;
	createdAt: number;
	updatedAt: number;
}

export interface TemplateCollection {
	id: string;
	name: string;
	templateIds: string[];
	customTemplates: CustomTemplate[];
	createdAt: number;
	updatedAt: number;
}

const FAVORITE_TEMPLATES_KEY = "mermaid-viewer-favorite-templates";
const TEMPLATE_COLLECTIONS_KEY = "mermaid-viewer-template-collections";

/**
 * Save a template to favorites
 *
 * @param templateId The ID of the template to favorite
 */
export function saveFavoriteTemplate(templateId: string): void {
	if (typeof window === "undefined") return;
	try {
		const favorites = getFavoriteTemplates();
		if (!favorites.find((fav) => fav.templateId === templateId)) {
			favorites.push({
				templateId,
				timestamp: Date.now(),
			});
			localStorage.setItem(FAVORITE_TEMPLATES_KEY, JSON.stringify(favorites));
		}
	} catch (error) {
		console.error("Failed to save favorite template:", error);
	}
}

/**
 * Get all favorite templates
 *
 * @returns Array of favorite templates
 */
export function getFavoriteTemplates(): FavoriteTemplate[] {
	if (typeof window === "undefined") return [];
	try {
		const storedFavorites = localStorage.getItem(FAVORITE_TEMPLATES_KEY);
		if (!storedFavorites) return [];
		return JSON.parse(storedFavorites);
	} catch (error) {
		console.error("Failed to parse favorite templates:", error);
		return [];
	}
}

/**
 * Remove a template from favorites
 *
 * @param templateId The ID of the template to remove
 */
export function removeFavoriteTemplate(templateId: string): void {
	if (typeof window === "undefined") return;
	try {
		const favorites = getFavoriteTemplates();
		const filteredFavorites = favorites.filter(
			(fav) => fav.templateId !== templateId,
		);
		localStorage.setItem(
			FAVORITE_TEMPLATES_KEY,
			JSON.stringify(filteredFavorites),
		);
	} catch (error) {
		console.error("Failed to remove favorite template:", error);
	}
}

/**
 * Check if a template is favorited
 *
 * @param templateId The ID of the template to check
 * @returns true if favorited, false otherwise
 */
export function isTemplateFavorited(templateId: string): boolean {
	const favorites = getFavoriteTemplates();
	return favorites.some((fav) => fav.templateId === templateId);
}

/**
 * Get template collections from local storage
 */
export function getTemplateCollections(): TemplateCollection[] {
	if (typeof window === "undefined") return [];
	try {
		const storedCollections = localStorage.getItem(TEMPLATE_COLLECTIONS_KEY);
		if (!storedCollections) return [];
		const parsedCollections = JSON.parse(storedCollections);
		if (!Array.isArray(parsedCollections)) return [];
		return parsedCollections.map((collection) => ({
			id: collection.id,
			name: collection.name,
			templateIds: Array.isArray(collection.templateIds)
				? Array.from(new Set(collection.templateIds))
				: [],
			customTemplates: Array.isArray(collection.customTemplates)
				? collection.customTemplates
						.filter(
							(template: unknown) =>
								template &&
								typeof template === "object" &&
								"name" in template &&
								"code" in template,
						)
						.map((template: Record<string, unknown>) => ({
							id:
								typeof template.id === "string" && template.id.trim()
									? template.id
									: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
							name:
								typeof template.name === "string"
									? template.name
									: "Untitled Template",
							code: typeof template.code === "string" ? template.code : "",
							createdAt:
								typeof template.createdAt === "number"
									? template.createdAt
									: Date.now(),
							updatedAt:
								typeof template.updatedAt === "number"
									? template.updatedAt
									: Date.now(),
						}))
				: [],
			createdAt: collection.createdAt ?? Date.now(),
			updatedAt: collection.updatedAt ?? Date.now(),
		}));
	} catch (error) {
		console.error("Failed to parse template collections:", error);
		return [];
	}
}

function persistTemplateCollections(collections: TemplateCollection[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(TEMPLATE_COLLECTIONS_KEY, JSON.stringify(collections));
	} catch (error) {
		console.error("Failed to persist template collections:", error);
	}
}

/**
 * Create a new template collection
 */
export function createTemplateCollection(name: string): TemplateCollection {
	const collections = getTemplateCollections();
	const timestamp = Date.now();
	const newCollection: TemplateCollection = {
		id: `collection_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
		name,
		templateIds: [],
		customTemplates: [],
		createdAt: timestamp,
		updatedAt: timestamp,
	};
	const updatedCollections = [...collections, newCollection];
	persistTemplateCollections(updatedCollections);
	return newCollection;
}

/**
 * Rename an existing template collection
 */
export function renameTemplateCollection(
	id: string,
	name: string,
): TemplateCollection | undefined {
	const collections = getTemplateCollections();
	const index = collections.findIndex((collection) => collection.id === id);
	if (index === -1) return undefined;

	const updatedCollection: TemplateCollection = {
		...collections[index],
		name,
		updatedAt: Date.now(),
	};

	const updatedCollections = [...collections];
	updatedCollections[index] = updatedCollection;
	persistTemplateCollections(updatedCollections);
	return updatedCollection;
}

/**
 * Delete a template collection
 */
export function deleteTemplateCollection(id: string): boolean {
	const collections = getTemplateCollections();
	const filteredCollections = collections.filter(
		(collection) => collection.id !== id,
	);
	if (filteredCollections.length === collections.length) {
		return false;
	}

	persistTemplateCollections(filteredCollections);
	return true;
}

/**
 * Add a template to a collection
 */
export function addTemplateToCollection(
	collectionId: string,
	templateId: string,
): TemplateCollection | undefined {
	const collections = getTemplateCollections();
	const index = collections.findIndex(
		(collection) => collection.id === collectionId,
	);
	if (index === -1) return undefined;

	const collection = collections[index];
	if (collection.templateIds.includes(templateId)) {
		return collection;
	}

	const updatedCollection: TemplateCollection = {
		...collection,
		templateIds: [...collection.templateIds, templateId],
		updatedAt: Date.now(),
	};

	const updatedCollections = [...collections];
	updatedCollections[index] = updatedCollection;
	persistTemplateCollections(updatedCollections);
	return updatedCollection;
}

/**
 * Add a custom template to a collection
 */
export function addCustomTemplateToCollection(
	collectionId: string,
	template: { name: string; code: string },
): CustomTemplate | undefined {
	const collections = getTemplateCollections();
	const index = collections.findIndex(
		(collection) => collection.id === collectionId,
	);
	if (index === -1) return undefined;

	const collection = collections[index];
	const timestamp = Date.now();
	const trimmedName = template.name.trim();
	const newTemplate: CustomTemplate = {
		id: `custom_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
		name: trimmedName || "Untitled Template",
		code: template.code,
		createdAt: timestamp,
		updatedAt: timestamp,
	};

	const updatedCollection: TemplateCollection = {
		...collection,
		customTemplates: [...collection.customTemplates, newTemplate],
		updatedAt: Date.now(),
	};

	const updatedCollections = [...collections];
	updatedCollections[index] = updatedCollection;
	persistTemplateCollections(updatedCollections);
	return newTemplate;
}

/**
 * Remove a template from a collection
 */
export function removeTemplateFromCollection(
	collectionId: string,
	templateId: string,
): TemplateCollection | undefined {
	const collections = getTemplateCollections();
	const index = collections.findIndex(
		(collection) => collection.id === collectionId,
	);
	if (index === -1) return undefined;

	const collection = collections[index];
	if (!collection.templateIds.includes(templateId)) {
		return collection;
	}

	const updatedCollection: TemplateCollection = {
		...collection,
		templateIds: collection.templateIds.filter((id) => id !== templateId),
		updatedAt: Date.now(),
	};

	const updatedCollections = [...collections];
	updatedCollections[index] = updatedCollection;
	persistTemplateCollections(updatedCollections);
	return updatedCollection;
}

/**
 * Remove a custom template from a collection
 */
export function removeCustomTemplateFromCollection(
	collectionId: string,
	customTemplateId: string,
): TemplateCollection | undefined {
	const collections = getTemplateCollections();
	const index = collections.findIndex(
		(collection) => collection.id === collectionId,
	);
	if (index === -1) return undefined;

	const collection = collections[index];
	const filteredTemplates = collection.customTemplates.filter(
		(template) => template.id !== customTemplateId,
	);

	if (filteredTemplates.length === collection.customTemplates.length) {
		return collection;
	}

	const updatedCollection: TemplateCollection = {
		...collection,
		customTemplates: filteredTemplates,
		updatedAt: Date.now(),
	};

	const updatedCollections = [...collections];
	updatedCollections[index] = updatedCollection;
	persistTemplateCollections(updatedCollections);
	return updatedCollection;
}

// AI Assistant Storage

import type {
	AiAssistantConfig,
	ChatHistory,
	ChatMessage,
	DiagramSnapshot,
} from "@/types/ai-assistant.types";

const AI_CHAT_HISTORY_KEY = "mermaid-viewer-ai-chat-history";
const AI_ASSISTANT_CONFIG_KEY = "mermaid-viewer-ai-config";
const AI_DIAGRAM_SNAPSHOTS_KEY = "mermaid-viewer-ai-snapshots";

/**
 * Save AI chat history to local storage
 *
 * @param history The chat history to save
 */
export function saveAiChatHistory(history: ChatHistory): void {
	if (typeof window === "undefined") return;
	try {
		const stringifiedData = JSON.stringify(history);
		const compressedData = pako.deflate(stringifiedData);
		const base64Data = btoa(
			String.fromCharCode.apply(null, Array.from(compressedData)),
		);
		localStorage.setItem(AI_CHAT_HISTORY_KEY, base64Data);
	} catch (error) {
		console.error("Failed to save AI chat history:", error);
		localStorage.setItem(AI_CHAT_HISTORY_KEY, JSON.stringify(history));
	}
}

/**
 * Get AI chat history from local storage
 *
 * @returns The chat history or null if not found
 */
export function getAiChatHistory(): ChatHistory | null {
	if (typeof window === "undefined") return null;
	try {
		const base64Data = localStorage.getItem(AI_CHAT_HISTORY_KEY);
		if (!base64Data) return null;

		const compressedData = new Uint8Array(
			atob(base64Data)
				.split("")
				.map((char) => char.charCodeAt(0)),
		);
		const decompressedData = pako.inflate(compressedData, { to: "string" });
		return JSON.parse(decompressedData);
	} catch (error) {
		console.warn(
			"Failed to parse compressed chat history, attempting fallback:",
			error,
		);
		try {
			const storedData = localStorage.getItem(AI_CHAT_HISTORY_KEY);
			if (!storedData) return null;
			return JSON.parse(storedData);
		} catch (fallbackError) {
			console.error("Failed to parse chat history:", fallbackError);
			return null;
		}
	}
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
	if (typeof window === "undefined") return;
	try {
		const stringifiedData = JSON.stringify(snapshots);
		const compressedData = pako.deflate(stringifiedData);
		const base64Data = btoa(
			String.fromCharCode.apply(null, Array.from(compressedData)),
		);
		localStorage.setItem(AI_DIAGRAM_SNAPSHOTS_KEY, base64Data);
	} catch (error) {
		console.error("Failed to save diagram snapshots:", error);
		localStorage.setItem(AI_DIAGRAM_SNAPSHOTS_KEY, JSON.stringify(snapshots));
	}
}

/**
 * Get diagram snapshots from local storage
 *
 * @returns Array of diagram snapshots
 */
export function getDiagramSnapshots(): DiagramSnapshot[] {
	if (typeof window === "undefined") return [];
	try {
		const base64Data = localStorage.getItem(AI_DIAGRAM_SNAPSHOTS_KEY);
		if (!base64Data) return [];

		const compressedData = new Uint8Array(
			atob(base64Data)
				.split("")
				.map((char) => char.charCodeAt(0)),
		);
		const decompressedData = pako.inflate(compressedData, { to: "string" });
		return JSON.parse(decompressedData);
	} catch (error) {
		console.warn(
			"Failed to parse compressed snapshots, attempting fallback:",
			error,
		);
		try {
			const storedData = localStorage.getItem(AI_DIAGRAM_SNAPSHOTS_KEY);
			if (!storedData) return [];
			return JSON.parse(storedData);
		} catch (fallbackError) {
			console.error("Failed to parse diagram snapshots:", fallbackError);
			return [];
		}
	}
}

/**
 * Clear diagram snapshots from local storage
 */
export function clearDiagramSnapshots(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(AI_DIAGRAM_SNAPSHOTS_KEY);
}
