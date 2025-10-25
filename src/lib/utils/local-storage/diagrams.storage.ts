import { compressToBase64, decompressFromBase64 } from "../compression.utils";

export interface SavedDiagram {
	id: string;
	name: string;
	code: string;
	timestamp: number;
}

const STORAGE_KEY = "mermaid-viewer-diagrams";

function persistDiagrams(diagrams: SavedDiagram[]): void {
	if (typeof window === "undefined") return;
	try {
		const serialized = JSON.stringify(diagrams);
		const base64Data = compressToBase64(serialized);
		localStorage.setItem(STORAGE_KEY, base64Data);
	} catch (error) {
		console.error("Failed to persist diagrams with compression:", error);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
	}
}

function parseStoredDiagrams(data: string): SavedDiagram[] {
	if (!data) return [];
	try {
		const decompressed = decompressFromBase64(data);
		return JSON.parse(decompressed);
	} catch (error) {
		console.warn(
			"Failed to parse compressed diagrams from local storage, attempting fallback:",
			error,
		);
		if (data.startsWith("[") || data.startsWith("{")) {
			try {
				return JSON.parse(data);
			} catch (fallbackError) {
				console.error(
					"Failed to parse diagrams from local storage (fallback JSON parse):",
					fallbackError,
				);
			}
		}
		return [];
	}
}

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
	persistDiagrams(diagrams);

	return newDiagram;
}

/**
 * Get all saved diagrams from local storage
 *
 * @returns Array of saved diagrams
 */
export function getAllDiagramsFromStorage(): SavedDiagram[] {
	if (typeof window === "undefined") return [];
	const storedData = localStorage.getItem(STORAGE_KEY);
	if (!storedData) return [];
	return parseStoredDiagrams(storedData);
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

	persistDiagrams(diagrams);
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

	persistDiagrams(filteredDiagrams);
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
