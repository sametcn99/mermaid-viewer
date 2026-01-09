/**
 * Sync Service - Handles synchronization between IndexedDB and Backend
 */

import {
	fullSync,
	type FullSyncRequest,
	type FullSyncResponse,
} from "@/lib/api";
import {
	getAllDiagramsFromStorage,
	saveDiagramToStorage,
	type SavedDiagram,
} from "@/lib/indexed-db/diagrams.storage";
import {
	getFavoriteTemplates,
	getTemplateCollections,
	saveFavoriteTemplate,
	removeFavoriteTemplate,
	type TemplateCollection,
	type FavoriteTemplate,
	type CustomTemplate,
} from "@/lib/indexed-db/templates.storage";
import {
	getMermaidConfig,
	saveMermaidConfig,
} from "@/lib/indexed-db/mermaid-config.storage";
import {
	getThemeSettings,
	saveThemeSettings,
} from "@/lib/indexed-db/theme.storage";
import {
	getRawItem,
	setRawItem,
	getAllKeys,
	withDatabase,
	STORE_NAMES,
	resetAllStores,
} from "@/lib/indexed-db";
import type {
	DiagramDto,
	TemplateCollectionDto,
	FavoriteTemplateDto,
	SettingsDto,
	CustomTemplateDto,
} from "@/lib/api/types";
import type { ThemeSettings } from "@/lib/theme";

export type SyncRequestPriority = "immediate" | "background";

export interface SyncRequest {
	reason: string;
	priority: SyncRequestPriority;
	requestedAt: number;
}

type SyncListener = (request: SyncRequest) => void;

const syncListeners = new Set<SyncListener>();

export function subscribeToSyncRequests(listener: SyncListener): () => void {
	syncListeners.add(listener);
	return () => {
		syncListeners.delete(listener);
	};
}

function dispatchSyncRequest(
	reason: string,
	priority: SyncRequestPriority,
): void {
	const payload: SyncRequest = {
		reason,
		priority,
		requestedAt: Date.now(),
	};

	for (const listener of syncListeners) {
		listener(payload);
	}
}

export function requestImmediateSync(reason: string): void {
	dispatchSyncRequest(reason, "immediate");
}

export function requestBackgroundSync(reason: string): void {
	dispatchSyncRequest(reason, "background");
}

// Storage keys for sync metadata
const LAST_SYNC_KEY = "mermaid-viewer-last-sync";

/**
 * Get the last sync timestamp
 */
export async function getLastSyncTimestamp(): Promise<number | null> {
	const value = await getRawItem(LAST_SYNC_KEY);
	return value ? Number.parseInt(value, 10) : null;
}

/**
 * Set the last sync timestamp
 */
export async function setLastSyncTimestamp(timestamp: number): Promise<void> {
	await setRawItem(LAST_SYNC_KEY, timestamp.toString());
}

/**
 * Export all local data for sync
 */
export async function exportLocalData(): Promise<FullSyncRequest> {
	const lastSyncAt = (await getLastSyncTimestamp()) ?? undefined;

	// Export diagrams
	const diagrams = await getAllDiagramsFromStorage();
	const diagramDtos: DiagramDto[] = diagrams.map((d) => ({
		clientId: d.id,
		name: d.name,
		code: d.code,
		clientTimestamp: d.timestamp,
		settings: d.settings ?? null,
	}));

	// Export templates
	const collections = await getTemplateCollections();
	const collectionDtos: TemplateCollectionDto[] = collections.map((c) => ({
		clientId: c.id,
		name: c.name,
		templateIds: c.templateIds,
		customTemplates: c.customTemplates.map((ct) => ({
			clientId: ct.id,
			name: ct.name,
			code: ct.code,
			clientTimestamp: ct.updatedAt,
		})),
		clientTimestamp: c.updatedAt,
	}));

	const favorites = await getFavoriteTemplates();
	const favoriteDtos: FavoriteTemplateDto[] = favorites.map((f) => ({
		templateId: f.templateId,
		clientTimestamp: f.timestamp,
	}));

	// Export settings
	const mermaidConfig = await getMermaidConfig();
	const themeSettings = await getThemeSettings();

	// Get key-value store entries (excluding sync metadata)
	const allKeys = await getAllKeys();
	const kvKeys = allKeys.filter(
		(key) =>
			!key.startsWith("mermaid-viewer-last-sync") &&
			key.startsWith("mermaid-viewer-"),
	);
	const keyValueStore: Record<string, string> = {};
	for (const key of kvKeys) {
		const value = await getRawItem(key);
		if (value) {
			keyValueStore[key] = value;
		}
	}

	const settingsDto: SettingsDto = {
		mermaidConfig: mermaidConfig as Record<string, unknown> | undefined,
		themeSettings: themeSettings
			? (themeSettings as unknown as Record<string, unknown>)
			: undefined,
		keyValueStore,
	};

	return {
		diagrams: {
			diagrams: diagramDtos,
			lastSyncAt,
		},
		templates: {
			collections: collectionDtos,
			favorites: favoriteDtos,
			lastSyncAt,
		},
		settings: {
			settings: settingsDto,
			lastSyncAt,
		},
	};
}

/**
 * Import data from server response into IndexedDB
 */
export async function importServerData(
	response: FullSyncResponse,
): Promise<void> {
	// Import diagrams
	for (const diagram of response.diagrams.diagrams) {
		await saveDiagramToStorage(diagram.name, diagram.code, {
			id: diagram.clientId,
			timestamp: diagram.clientTimestamp,
			settings: diagram.settings ?? null,
		});
	}

	// Import template collections
	for (const collection of response.templates.collections) {
		const templateCollection = {
			id: collection.clientId,
			name: collection.name,
			templateIds: collection.templateIds,
			customTemplates: collection.customTemplates.map((ct) => ({
				id: ct.clientId,
				name: ct.name,
				code: ct.code,
				createdAt: ct.clientTimestamp,
				updatedAt: ct.clientTimestamp,
			})),
			createdAt: collection.clientTimestamp,
			updatedAt: collection.clientTimestamp,
		};
		await withDatabase((db) =>
			db.put(STORE_NAMES.TEMPLATE_COLLECTIONS, templateCollection),
		);
	}

	// Import favorites
	// First get current favorites to compare
	const currentFavorites = await getFavoriteTemplates();
	const currentFavoriteIds = new Set(currentFavorites.map((f) => f.templateId));
	const serverFavoriteIds = new Set(
		response.templates.favorites.map((f) => f.templateId),
	);

	// Add new favorites
	for (const favorite of response.templates.favorites) {
		if (!currentFavoriteIds.has(favorite.templateId)) {
			await saveFavoriteTemplate(favorite.templateId);
		}
	}

	// Remove favorites not in server
	for (const currentFav of currentFavorites) {
		if (!serverFavoriteIds.has(currentFav.templateId)) {
			await removeFavoriteTemplate(currentFav.templateId);
		}
	}

	// Import settings
	if (response.settings.settings) {
		if (response.settings.settings.mermaidConfig) {
			await saveMermaidConfig(response.settings.settings.mermaidConfig);
		}
		if (response.settings.settings.themeSettings) {
			await saveThemeSettings(
				response.settings.settings.themeSettings as unknown as ThemeSettings,
			);
		}
		if (response.settings.settings.keyValueStore) {
			for (const [key, value] of Object.entries(
				response.settings.settings.keyValueStore,
			)) {
				await setRawItem(key, value);
			}
		}
	}

	// Update last sync timestamp
	await setLastSyncTimestamp(response.syncedAt);
}

/**
 * Perform full sync with the server
 */
export async function performFullSync(): Promise<FullSyncResponse> {
	const localData = await exportLocalData();
	const response = await fullSync(localData);
	await importServerData(response);
	return response;
}

/**
 * Clear all local data (for logout)
 */
export async function clearLocalSyncData(): Promise<void> {
	await resetAllStores();
}
