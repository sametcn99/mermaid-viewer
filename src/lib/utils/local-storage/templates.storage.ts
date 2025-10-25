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

function sanitizeCustomTemplates(templates: unknown[]): CustomTemplate[] {
	return templates
		.filter(
			(template) =>
				template &&
				typeof template === "object" &&
				"name" in template &&
				"code" in template,
		)
		.map((template) => {
			const record = template as Record<string, unknown>;
			const timestamp = Date.now();
			return {
				id:
					typeof record.id === "string" && record.id.trim()
						? record.id
						: `custom_${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
				name:
					typeof record.name === "string" ? record.name : "Untitled Template",
				code: typeof record.code === "string" ? record.code : "",
				createdAt:
					typeof record.createdAt === "number" ? record.createdAt : timestamp,
				updatedAt:
					typeof record.updatedAt === "number" ? record.updatedAt : timestamp,
			};
		});
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
				? sanitizeCustomTemplates(collection.customTemplates)
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
