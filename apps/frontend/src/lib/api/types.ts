/**
 * API Types for Backend Communication
 */

import type { DiagramSettingsConfig } from "@/lib/diagram-settings";

// Auth Types
export interface User {
	id: string;
	email: string;
	displayName: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	displayName?: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export interface UpdateProfileRequest {
	displayName?: string;
	currentPassword?: string;
	newPassword?: string;
}

// Diagram Types
export interface DiagramDto {
	id?: string;
	clientId: string;
	name: string;
	code: string;
	clientTimestamp: number;
	updatedAt?: string;
	settings?: DiagramSettingsConfig | null;
}

export interface SyncDiagramsRequest {
	diagrams: DiagramDto[];
	lastSyncAt?: number;
}

export interface SyncDiagramsResponse {
	diagrams: DiagramDto[];
	syncedAt: number;
}

// Template Types
export interface CustomTemplateDto {
	id?: string;
	clientId: string;
	name: string;
	code: string;
	clientTimestamp: number;
}

export interface TemplateCollectionDto {
	id?: string;
	clientId: string;
	name: string;
	templateIds: string[];
	customTemplates: CustomTemplateDto[];
	clientTimestamp: number;
}

export interface FavoriteTemplateDto {
	templateId: string;
	clientTimestamp: number;
}

export interface SyncTemplatesRequest {
	collections: TemplateCollectionDto[];
	favorites: FavoriteTemplateDto[];
	lastSyncAt?: number;
}

export interface SyncTemplatesResponse {
	collections: TemplateCollectionDto[];
	favorites: FavoriteTemplateDto[];
	syncedAt: number;
}

// AI Assistant Types
export interface ChatMessageDto {
	id?: string;
	clientId: string;
	role: "user" | "assistant";
	content: string;
	diagramCode?: string;
	clientTimestamp: number;
}

export interface DiagramSnapshotDto {
	id?: string;
	messageClientId: string;
	code: string;
	clientTimestamp: number;
}

export interface AiConfigDto {
	consentGiven: boolean;
	userApiKey?: string;
	selectedModel?: string;
	lastConsentDate?: number;
	updatedAt?: number;
}

export interface SyncAiRequest {
	chatMessages: ChatMessageDto[];
	snapshots: DiagramSnapshotDto[];
	config?: AiConfigDto;
	lastSyncAt?: number;
}

export interface SyncAiResponse {
	chatMessages: ChatMessageDto[];
	snapshots: DiagramSnapshotDto[];
	config: AiConfigDto | null;
	syncedAt: number;
}

// Settings Types
export interface SettingsDto {
	mermaidConfig?: Record<string, unknown>;
	themeSettings?: Record<string, unknown>;
	keyValueStore?: Record<string, string>;
	updatedAt?: number;
}

export interface SyncSettingsRequest {
	settings: SettingsDto;
	lastSyncAt?: number;
}

export interface SyncSettingsResponse {
	settings: SettingsDto;
	syncedAt: number;
}

// Full Sync Types
export interface FullSyncRequest {
	diagrams: SyncDiagramsRequest;
	templates: SyncTemplatesRequest;
	ai: SyncAiRequest;
	settings: SyncSettingsRequest;
}

export interface FullSyncResponse {
	diagrams: SyncDiagramsResponse;
	templates: SyncTemplatesResponse;
	ai: SyncAiResponse;
	settings: SyncSettingsResponse;
	syncedAt: number;
}

// API Error
export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}
