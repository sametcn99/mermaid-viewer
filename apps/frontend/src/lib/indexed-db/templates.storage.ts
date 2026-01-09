import { STORE_NAMES, withDatabase } from ".";
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

const FAVORITE_TEMPLATES_STORE = STORE_NAMES.TEMPLATE_FAVORITES;
const TEMPLATE_COLLECTIONS_STORE = STORE_NAMES.TEMPLATE_COLLECTIONS;

function notifyFavoritesChanged(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("templateFavoritesChanged"));
	}
}

function notifyCollectionsChanged(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("templateCollectionsChanged"));
	}
}

/**
 * Save a template to favorites
 *
 * @param templateId The ID of the template to favorite
 */
export async function saveFavoriteTemplate(templateId: string): Promise<void> {
	try {
		const existing = await withDatabase((db) =>
			db.get(FAVORITE_TEMPLATES_STORE, templateId),
		);
		if (existing) return;

		await withDatabase((db) =>
			db.put(FAVORITE_TEMPLATES_STORE, {
				templateId,
				timestamp: Date.now(),
			}),
		);
		notifyFavoritesChanged();
	} catch (error) {
		console.error("Failed to save favorite template:", error);
	}
}

/**
 * Get all favorite templates
 *
 * @returns Array of favorite templates
 */
export async function getFavoriteTemplates(): Promise<FavoriteTemplate[]> {
	try {
		const favorites = await withDatabase((db) =>
			db.getAll(FAVORITE_TEMPLATES_STORE),
		);
		return favorites
			.filter((favorite): favorite is FavoriteTemplate => Boolean(favorite))
			.sort((a, b) => b.timestamp - a.timestamp);
	} catch (error) {
		console.error("Failed to load favorite templates:", error);
		return [];
	}
}

/**
 * Remove a template from favorites
 *
 * @param templateId The ID of the template to remove
 */
export async function removeFavoriteTemplate(
	templateId: string,
): Promise<void> {
	try {
		await withDatabase((db) => db.delete(FAVORITE_TEMPLATES_STORE, templateId));
		notifyFavoritesChanged();
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
export async function isTemplateFavorited(
	templateId: string,
): Promise<boolean> {
	const favorite = await withDatabase((db) =>
		db.get(FAVORITE_TEMPLATES_STORE, templateId),
	);
	return Boolean(favorite);
}

/**
 * Get template collections from local storage
 */
export async function getTemplateCollections(): Promise<TemplateCollection[]> {
	try {
		const collections = await withDatabase((db) =>
			db.getAll(TEMPLATE_COLLECTIONS_STORE),
		);
		return collections
			.filter((collection): collection is TemplateCollection =>
				Boolean(collection),
			)
			.sort((a, b) => b.updatedAt - a.updatedAt);
	} catch (error) {
		console.error("Failed to load template collections:", error);
		return [];
	}
}

/**
 * Create a new template collection
 */
export async function createTemplateCollection(
	name: string,
): Promise<TemplateCollection> {
	const timestamp = Date.now();
	const trimmedName = name.trim();
	const newCollection: TemplateCollection = {
		id: `collection_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
		name: trimmedName || "Untitled Collection",
		templateIds: [],
		customTemplates: [],
		createdAt: timestamp,
		updatedAt: timestamp,
	};

	await withDatabase((db) => db.put(TEMPLATE_COLLECTIONS_STORE, newCollection));
	notifyCollectionsChanged();
	return newCollection;
}

/**
 * Rename an existing template collection
 */
export async function renameTemplateCollection(
	id: string,
	name: string,
): Promise<TemplateCollection | undefined> {
	const trimmedName = name.trim();

	const updated = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(id);
		if (!existing) {
			await tx.done;
			return undefined;
		}

		const nextCollection: TemplateCollection = {
			...existing,
			name: trimmedName || existing.name,
			customTemplates: existing.customTemplates as CustomTemplate[],
			updatedAt: Date.now(),
		};

		await store.put(nextCollection);
		await tx.done;
		return nextCollection;
	});

	if (updated) {
		notifyCollectionsChanged();
	}

	return updated;
}

/**
 * Delete a template collection
 */
export async function deleteTemplateCollection(id: string): Promise<boolean> {
	const deleted = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(id);
		if (!existing) {
			await tx.done;
			return false;
		}

		await store.delete(id);
		await tx.done;
		return true;
	});

	if (deleted) {
		notifyCollectionsChanged();
	}

	return deleted;
}

/**
 * Add a template to a collection
 */
export async function addTemplateToCollection(
	collectionId: string,
	templateId: string,
): Promise<TemplateCollection | undefined> {
	const updated = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(collectionId);
		if (!existing) {
			await tx.done;
			return undefined;
		}

		if (existing.templateIds.includes(templateId)) {
			await tx.done;
			return existing as TemplateCollection;
		}

		const nextCollection: TemplateCollection = {
			...existing,
			templateIds: [...existing.templateIds, templateId],
			customTemplates: existing.customTemplates as CustomTemplate[],
			updatedAt: Date.now(),
		};

		await store.put(nextCollection);
		await tx.done;
		return nextCollection;
	});

	if (updated?.templateIds.includes(templateId)) {
		notifyCollectionsChanged();
	}

	return updated;
}

/**
 * Add a custom template to a collection
 */
export async function addCustomTemplateToCollection(
	collectionId: string,
	template: { name: string; code: string },
): Promise<CustomTemplate | undefined> {
	const created = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(collectionId);
		if (!existing) {
			await tx.done;
			return undefined;
		}

		const timestamp = Date.now();
		const trimmedName = template.name.trim();
		const newTemplate: CustomTemplate = {
			id: `custom_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
			name: trimmedName || "Untitled Template",
			code: template.code,
			createdAt: timestamp,
			updatedAt: timestamp,
		};

		const nextCollection: TemplateCollection = {
			...existing,
			customTemplates: [
				...(existing.customTemplates as CustomTemplate[]),
				newTemplate,
			],
			updatedAt: Date.now(),
		};

		await store.put(nextCollection);
		await tx.done;
		return newTemplate;
	});

	if (created) {
		notifyCollectionsChanged();
	}

	return created;
}

/**
 * Remove a template from a collection
 */
export async function removeTemplateFromCollection(
	collectionId: string,
	templateId: string,
): Promise<TemplateCollection | undefined> {
	const updated = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(collectionId);
		if (!existing) {
			await tx.done;
			return undefined;
		}

		if (!existing.templateIds.includes(templateId)) {
			await tx.done;
			return existing as TemplateCollection;
		}

		const nextCollection: TemplateCollection = {
			...existing,
			templateIds: existing.templateIds.filter((id) => id !== templateId),
			customTemplates: existing.customTemplates as CustomTemplate[],
			updatedAt: Date.now(),
		};

		await store.put(nextCollection);
		await tx.done;
		return nextCollection;
	});

	if (updated) {
		notifyCollectionsChanged();
	}

	return updated;
}

/**
 * Remove a custom template from a collection
 */
export async function removeCustomTemplateFromCollection(
	collectionId: string,
	customTemplateId: string,
): Promise<TemplateCollection | undefined> {
	const updated = await withDatabase(async (db) => {
		const tx = db.transaction(TEMPLATE_COLLECTIONS_STORE, "readwrite");
		const store = tx.store;
		const existing = await store.get(collectionId);
		if (!existing) {
			await tx.done;
			return undefined;
		}

		const filteredTemplates = (
			existing.customTemplates as CustomTemplate[]
		).filter((template) => template.id !== customTemplateId);

		if (filteredTemplates.length === existing.customTemplates.length) {
			await tx.done;
			return existing as TemplateCollection;
		}

		const nextCollection: TemplateCollection = {
			...existing,
			customTemplates: filteredTemplates as CustomTemplate[],
			updatedAt: Date.now(),
		};

		await store.put(nextCollection);
		await tx.done;
		return nextCollection;
	});

	if (updated) {
		notifyCollectionsChanged();
	}

	return updated;
}
