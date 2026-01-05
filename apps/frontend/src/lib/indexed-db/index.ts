/*
 * Shared IndexedDB helper for client-side persistence.
 * Provides a small key-value API wrapper with graceful fallbacks
 * for non-browser environments.
 */

import { deleteDB, openDB } from "idb";
import type { DBSchema, IDBPDatabase, IDBPTransaction } from "idb";

const DB_NAME = "mermaid-viewer-db";
const DB_VERSION = 3;
const STORE_NAME = "kv";
const STORE_DIAGRAMS = "diagrams";
const STORE_TEMPLATE_FAVORITES = "templateFavorites";
const STORE_TEMPLATE_COLLECTIONS = "templateCollections";
const STORE_AI_CHAT_HISTORY = "aiChatHistory";
const STORE_AI_ASSISTANT_CONFIG = "aiAssistantConfig";
const STORE_AI_DIAGRAM_SNAPSHOTS = "aiDiagramSnapshots";
const STORE_MERMAID_CONFIG = "mermaidConfig";
const STORE_THEME_SETTINGS = "themeSettings";

export const STORE_NAMES = {
	KEY_VALUE: STORE_NAME,
	DIAGRAMS: STORE_DIAGRAMS,
	TEMPLATE_FAVORITES: STORE_TEMPLATE_FAVORITES,
	TEMPLATE_COLLECTIONS: STORE_TEMPLATE_COLLECTIONS,
	AI_CHAT_HISTORY: STORE_AI_CHAT_HISTORY,
	AI_ASSISTANT_CONFIG: STORE_AI_ASSISTANT_CONFIG,
	AI_DIAGRAM_SNAPSHOTS: STORE_AI_DIAGRAM_SNAPSHOTS,
	MERMAID_CONFIG: STORE_MERMAID_CONFIG,
	THEME_SETTINGS: STORE_THEME_SETTINGS,
} as const;

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];

type IDBValue = string;

interface KeyValueRecord {
	key: string;
	value: IDBValue;
}

interface MermaidViewerDB extends DBSchema {
	kv: {
		key: string;
		value: KeyValueRecord;
	};
	diagrams: {
		key: string;
		value: {
			id: string;
			name: string;
			code: string;
			timestamp: number;
		};
		indexes: {
			byTimestamp: number;
			byName: string;
			byCode: string;
		};
	};
	templateFavorites: {
		key: string;
		value: {
			templateId: string;
			timestamp: number;
		};
		indexes: { byTimestamp: number };
	};
	templateCollections: {
		key: string;
		value: {
			id: string;
			name: string;
			templateIds: string[];
			customTemplates: unknown[];
			createdAt: number;
			updatedAt: number;
		};
		indexes: { byUpdatedAt: number };
	};
	aiChatHistory: {
		key: string;
		value: {
			id: string;
			messages: unknown[];
			lastUpdated: number;
		};
		indexes: { byLastUpdated: number };
	};
	aiAssistantConfig: {
		key: string;
		value: {
			id: string;
			config: unknown;
			updatedAt: number;
		};
		indexes: { byUpdatedAt: number };
	};
	aiDiagramSnapshots: {
		key: string;
		value: {
			messageId: string;
			code: string;
			timestamp: number;
		};
		indexes: { byTimestamp: number };
	};
	mermaidConfig: {
		key: string;
		value: {
			id: string;
			config: unknown;
			updatedAt: number;
		};
		indexes: { byUpdatedAt: number };
	};
	themeSettings: {
		key: string;
		value: {
			id: string;
			settings: unknown;
			updatedAt: number;
		};
		indexes: { byUpdatedAt: number };
	};
}

const memoryStore = new Map<string, IDBValue>();
let dbPromise: Promise<IDBPDatabase<MermaidViewerDB>> | null = null;
let hasLoggedSupportWarning = false;

function isBrowser(): boolean {
	return typeof window !== "undefined" && typeof document !== "undefined";
}

function isIndexedDbSupported(): boolean {
	return isBrowser() && "indexedDB" in window;
}

function shouldResetDatabase(error: unknown): boolean {
	return (
		error instanceof DOMException &&
		(error.name === "InvalidStateError" ||
			error.name === "NotFoundError" ||
			error.name === "VersionError")
	);
}

function logSupportWarning(message: string, error?: unknown): void {
	if (hasLoggedSupportWarning) return;
	if (error !== undefined && error !== null) {
		console.warn(message, error);
	} else {
		console.warn(message);
	}
	hasLoggedSupportWarning = true;
}

function getMemoryItem(key: string): IDBValue | null {
	const value = memoryStore.get(key);
	return value !== undefined ? value : null;
}

function setMemoryItem(key: string, value: IDBValue): void {
	memoryStore.set(key, value);
}

function removeMemoryItem(key: string): void {
	memoryStore.delete(key);
}

type UpgradeTransaction = IDBPTransaction<
	MermaidViewerDB,
	StoreName[],
	"versionchange"
>;

type IDBKeyPath = string | string[];

interface StoreIndexDefinition {
	name: string;
	keyPath: IDBKeyPath;
	options?: IDBIndexParameters;
}

function ensureStore(
	db: IDBPDatabase<MermaidViewerDB>,
	transaction: UpgradeTransaction | undefined,
	storeName: StoreName,
	options: IDBObjectStoreParameters,
	indexes: StoreIndexDefinition[] = [],
): void {
	let store: IDBObjectStore | undefined;

	if (!db.objectStoreNames.contains(storeName)) {
		store = db.createObjectStore(
			storeName,
			options,
		) as unknown as IDBObjectStore;
	} else if (transaction) {
		store = transaction.objectStore(storeName) as unknown as IDBObjectStore;
	}

	if (!store) return;

	for (const { name, keyPath, options: indexOptions } of indexes) {
		if (!store.indexNames.contains(name)) {
			store.createIndex(name, keyPath, indexOptions);
		}
	}
}

async function closeDatabaseConnection(): Promise<void> {
	const currentPromise = dbPromise;
	dbPromise = null;

	if (!currentPromise) {
		return;
	}

	try {
		const db = await currentPromise;
		db.close();
	} catch (error) {
		console.warn("Failed to close IndexedDB connection:", error);
	}
}

async function resetDatabase(): Promise<void> {
	await closeDatabaseConnection();

	if (!isIndexedDbSupported()) {
		return;
	}

	try {
		await deleteDB(DB_NAME);
	} catch (error) {
		console.warn("Failed to delete IndexedDB database during reset:", error);
	}
}

async function openDatabase(): Promise<IDBPDatabase<MermaidViewerDB>> {
	if (!isIndexedDbSupported()) {
		throw new Error("IndexedDB is not supported in this environment");
	}

	if (!dbPromise) {
		dbPromise = openDB<MermaidViewerDB>(DB_NAME, DB_VERSION, {
			upgrade(db, _oldVersion, _newVersion, transaction) {
				const upgradeTx = transaction as unknown as
					| UpgradeTransaction
					| undefined;

				ensureStore(db, upgradeTx, STORE_NAMES.KEY_VALUE, { keyPath: "key" });

				ensureStore(db, upgradeTx, STORE_NAMES.DIAGRAMS, { keyPath: "id" }, [
					{ name: "byTimestamp", keyPath: "timestamp" },
					{ name: "byName", keyPath: "name" },
					{ name: "byCode", keyPath: "code" },
				]);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.TEMPLATE_FAVORITES,
					{ keyPath: "templateId" },
					[{ name: "byTimestamp", keyPath: "timestamp" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.TEMPLATE_COLLECTIONS,
					{ keyPath: "id" },
					[{ name: "byUpdatedAt", keyPath: "updatedAt" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.AI_CHAT_HISTORY,
					{ keyPath: "id" },
					[{ name: "byLastUpdated", keyPath: "lastUpdated" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.AI_ASSISTANT_CONFIG,
					{ keyPath: "id" },
					[{ name: "byUpdatedAt", keyPath: "updatedAt" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.AI_DIAGRAM_SNAPSHOTS,
					{ keyPath: "messageId" },
					[{ name: "byTimestamp", keyPath: "timestamp" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.MERMAID_CONFIG,
					{ keyPath: "id" },
					[{ name: "byUpdatedAt", keyPath: "updatedAt" }],
				);

				ensureStore(
					db,
					upgradeTx,
					STORE_NAMES.THEME_SETTINGS,
					{ keyPath: "id" },
					[{ name: "byUpdatedAt", keyPath: "updatedAt" }],
				);
			},
			blocked() {
				logSupportWarning(
					"IndexedDB upgrade blocked by another tab; continuing with existing data.",
				);
			},
			blocking() {
				logSupportWarning(
					"IndexedDB upgrade requires existing tabs to close; closing current connection.",
				);
				void closeDatabaseConnection();
			},
			terminated() {
				logSupportWarning(
					"IndexedDB connection terminated unexpectedly; falling back to memory store.",
				);
				void closeDatabaseConnection();
			},
		})
			.then((db) => {
				db.addEventListener("versionchange", () => {
					db.close();
					dbPromise = null;
					logSupportWarning(
						"IndexedDB version change detected; closing connection.",
					);
				});
				return db;
			})
			.catch(async (error) => {
				if (shouldResetDatabase(error)) {
					await resetDatabase();
				}
				throw error;
			});
	}

	return dbPromise;
}

async function executeDbOperation<T>(
	operation: (db: IDBPDatabase<MermaidViewerDB>) => Promise<T>,
): Promise<T> {
	if (!isIndexedDbSupported()) {
		throw new Error("IndexedDB is not supported in this environment");
	}

	const db = await openDatabase();
	try {
		return await operation(db);
	} catch (error) {
		if (shouldResetDatabase(error)) {
			await resetDatabase();
		}
		throw error;
	}
}

export async function withDatabase<T>(
	operation: (db: IDBPDatabase<MermaidViewerDB>) => Promise<T>,
): Promise<T> {
	if (!isIndexedDbSupported()) {
		throw new Error("IndexedDB is not supported in this environment");
	}
	return executeDbOperation(operation);
}

export async function getRawItem(key: string): Promise<string | null> {
	if (!isBrowser()) {
		return getMemoryItem(key);
	}

	const cachedValue = getMemoryItem(key);
	if (cachedValue !== null) {
		return cachedValue;
	}

	if (!isIndexedDbSupported()) {
		logSupportWarning(
			"IndexedDB not supported; continuing with in-memory store.",
		);
		return null;
	}

	try {
		const record = await executeDbOperation((db) =>
			db.get(STORE_NAMES.KEY_VALUE, key),
		);
		if (record) {
			setMemoryItem(key, record.value);
			return record.value;
		}
		removeMemoryItem(key);
		return null;
	} catch (error) {
		logSupportWarning(
			"IndexedDB getRawItem failed, falling back to memory store.",
			error,
		);
		return getMemoryItem(key);
	}
}

export async function setRawItem(key: string, value: IDBValue): Promise<void> {
	if (!isBrowser()) {
		setMemoryItem(key, value);
		return;
	}

	setMemoryItem(key, value);

	if (!isIndexedDbSupported()) {
		logSupportWarning(
			"IndexedDB not supported; persisting values in memory only.",
		);
		return;
	}

	try {
		await executeDbOperation((db) =>
			db.put(STORE_NAMES.KEY_VALUE, { key, value }),
		);
	} catch (error) {
		logSupportWarning(
			"IndexedDB setRawItem failed; continuing with in-memory store.",
			error,
		);
		console.error("IndexedDB setRawItem failed:", error);
	}
}

export async function removeRawItem(key: string): Promise<void> {
	if (!isBrowser()) {
		removeMemoryItem(key);
		return;
	}

	removeMemoryItem(key);

	if (!isIndexedDbSupported()) {
		logSupportWarning(
			"IndexedDB not supported; removals limited to in-memory store.",
		);
		return;
	}

	try {
		await executeDbOperation((db) => db.delete(STORE_NAMES.KEY_VALUE, key));
	} catch (error) {
		logSupportWarning(
			"IndexedDB removeRawItem failed; continuing with in-memory store.",
			error,
		);
		console.error("IndexedDB removeRawItem failed:", error);
	}
}

export async function clearAll(): Promise<void> {
	memoryStore.clear();

	if (!isIndexedDbSupported()) {
		logSupportWarning(
			"IndexedDB not supported; cleared data from in-memory store only.",
		);
		return;
	}

	try {
		await executeDbOperation((db) => db.clear(STORE_NAMES.KEY_VALUE));
	} catch (error) {
		logSupportWarning(
			"IndexedDB clearAll failed; continuing with in-memory store.",
			error,
		);
		console.error("IndexedDB clearAll failed:", error);
	}
}

export async function resetAllStores(): Promise<void> {
	memoryStore.clear();

	if (!isBrowser()) {
		return;
	}

	if (!isIndexedDbSupported()) {
		logSupportWarning(
			"IndexedDB not supported; cleared data from in-memory store only.",
		);
		return;
	}

	try {
		await resetDatabase();
	} catch (error) {
		console.error("Failed to reset IndexedDB database:", error);
	}
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
	const raw = await getRawItem(key);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as T;
	} catch (error) {
		console.error(`Failed to parse JSON for key ${key}:`, error);
		return null;
	}
}

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
	try {
		await setRawItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Failed to stringify JSON for key ${key}:`, error);
	}
}

export async function getAllKeys(): Promise<string[]> {
	if (!isBrowser() || !isIndexedDbSupported()) {
		return Array.from(memoryStore.keys());
	}

	try {
		const keys = await executeDbOperation((db) =>
			db.getAllKeys(STORE_NAMES.KEY_VALUE),
		);
		return (keys as IDBValidKey[]).map((key) => String(key));
	} catch (error) {
		console.error("IndexedDB getAllKeys failed:", error);
		return Array.from(memoryStore.keys());
	}
}

export function hasIndexedDbSupport(): boolean {
	return isIndexedDbSupported();
}
