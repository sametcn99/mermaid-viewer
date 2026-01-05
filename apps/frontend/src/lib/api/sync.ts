/**
 * Sync API Functions
 */

import { api } from "./client";
import type {
	FullSyncRequest,
	FullSyncResponse,
	SyncDiagramsRequest,
	SyncDiagramsResponse,
	SyncTemplatesRequest,
	SyncTemplatesResponse,
	SyncAiRequest,
	SyncAiResponse,
	SyncSettingsRequest,
	SyncSettingsResponse,
} from "./types";

/**
 * Sync diagrams with the server
 */
export async function syncDiagrams(
	data: SyncDiagramsRequest,
): Promise<SyncDiagramsResponse> {
	return api.post<SyncDiagramsResponse>("/diagrams/sync", data);
}

/**
 * Sync templates with the server
 */
export async function syncTemplates(
	data: SyncTemplatesRequest,
): Promise<SyncTemplatesResponse> {
	return api.post<SyncTemplatesResponse>("/templates/sync", data);
}

/**
 * Sync AI assistant data with the server
 */
export async function syncAi(data: SyncAiRequest): Promise<SyncAiResponse> {
	return api.post<SyncAiResponse>("/ai/sync", data);
}

/**
 * Sync settings with the server
 */
export async function syncSettings(
	data: SyncSettingsRequest,
): Promise<SyncSettingsResponse> {
	return api.post<SyncSettingsResponse>("/settings/sync", data);
}

/**
 * Perform a full sync of all data
 */
export async function fullSync(
	data: FullSyncRequest,
): Promise<FullSyncResponse> {
	return api.post<FullSyncResponse>("/sync/full", data);
}
