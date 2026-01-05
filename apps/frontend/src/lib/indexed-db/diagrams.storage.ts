import { STORE_NAMES, withDatabase } from ".";
import type { DiagramSettingsConfig } from "@/lib/diagram-settings";

export interface SavedDiagram {
	id: string;
	name: string;
	code: string;
	timestamp: number;
	settings?: DiagramSettingsConfig | null;
}

const DIAGRAM_STORE = STORE_NAMES.DIAGRAMS;

function notifyDiagramsChanged(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("diagramsChanged"));
	}
}

async function getUntitledDiagramIndex(): Promise<number> {
	const count = await withDatabase((db) => db.count(DIAGRAM_STORE));
	return count + 1;
}

/**
 * Save a diagram to local storage
 *
 * @param name The name of the diagram
 * @param code The Mermaid code to save
 * @returns The saved diagram object with ID
 */
export async function saveDiagramToStorage(
	name: string,
	code: string,
	options?: { id?: string; timestamp?: number; settings?: DiagramSettingsConfig | null },
): Promise<SavedDiagram> {
	const trimmedName = name.trim();
	const diagramName = trimmedName.length
		? trimmedName
		: `Untitled Diagram ${await getUntitledDiagramIndex()}`;
	const timestamp = options?.timestamp ?? Date.now();
	const settings = options?.settings ?? null;
	const id =
		options?.id ??
		`diagram_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

	const newDiagram: SavedDiagram = {
		id,
		name: diagramName,
		code,
		timestamp,
		settings,
	};

	await withDatabase((db) => db.put(DIAGRAM_STORE, newDiagram));
	notifyDiagramsChanged();

	return newDiagram;
}

/**
 * Get all saved diagrams from local storage
 *
 * @returns Array of saved diagrams
 */
export async function getAllDiagramsFromStorage(): Promise<SavedDiagram[]> {
	const diagrams = await withDatabase((db) => db.getAll(DIAGRAM_STORE));
	return diagrams
		.filter((diagram): diagram is SavedDiagram => Boolean(diagram))
		.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get a specific diagram by ID
 *
 * @param id The ID of the diagram to retrieve
 * @returns The diagram if found, or undefined
 */
export async function getDiagramById(
	id: string,
): Promise<SavedDiagram | undefined> {
	const diagram = await withDatabase((db) => db.get(DIAGRAM_STORE, id));
	return diagram ?? undefined;
}

/**
 * Update an existing diagram in storage
 *
 * @param id The ID of the diagram to update
 * @param updates The properties to update
 * @returns The updated diagram if found, or undefined
 */
export async function updateDiagram(
	id: string,
	updates: Partial<Omit<SavedDiagram, "id">>,
): Promise<SavedDiagram | undefined> {
	const existing = await withDatabase((db) => db.get(DIAGRAM_STORE, id));
	if (!existing) return undefined;

	const updated: SavedDiagram = {
		...existing,
		...updates,
		timestamp: Date.now(),
	};

	await withDatabase((db) => db.put(DIAGRAM_STORE, updated));
	notifyDiagramsChanged();
	return updated;
}

/**
 * Delete a diagram from storage
 *
 * @param id The ID of the diagram to delete
 * @returns true if deleted, false if not found
 */
export async function deleteDiagram(id: string): Promise<boolean> {
	const exists = await withDatabase((db) => db.get(DIAGRAM_STORE, id));
	if (!exists) return false;

	await withDatabase((db) => db.delete(DIAGRAM_STORE, id));
	notifyDiagramsChanged();
	return true;
}

/**
 * Check if the current code matches any saved diagram
 *
 * @param code The current code to check
 * @returns The matching diagram ID if found, or undefined
 */
export async function findMatchingDiagramId(
	code: string,
): Promise<string | undefined> {
	const match = await withDatabase((db) =>
		db.getFromIndex(DIAGRAM_STORE, "byCode", code),
	);
	return match?.id;
}
