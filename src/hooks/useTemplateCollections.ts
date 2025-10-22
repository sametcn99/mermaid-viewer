"use client";

import { useCallback, useEffect, useState } from "react";

import type { CustomTemplate, TemplateCollection } from "@/lib/storage.utils";
import {
	addTemplateToCollection,
	addCustomTemplateToCollection,
	createTemplateCollection,
	deleteTemplateCollection,
	getTemplateCollections,
	removeCustomTemplateFromCollection,
	removeTemplateFromCollection,
	renameTemplateCollection,
} from "@/lib/storage.utils";

interface UseTemplateCollections {
	collections: TemplateCollection[];
	createCollection: (name: string) => TemplateCollection | null;
	renameCollection: (
		id: string,
		name: string,
	) => TemplateCollection | undefined;
	deleteCollection: (id: string) => boolean;
	addTemplate: (
		collectionId: string,
		templateId: string,
	) => TemplateCollection | undefined;
	removeTemplate: (
		collectionId: string,
		templateId: string,
	) => TemplateCollection | undefined;
	addCustomTemplate: (
		collectionId: string,
		template: { name: string; code: string },
	) => CustomTemplate | undefined;
	removeCustomTemplate: (
		collectionId: string,
		customTemplateId: string,
	) => TemplateCollection | undefined;
	refreshCollections: () => void;
}

export function useTemplateCollections(): UseTemplateCollections {
	const [collections, setCollections] = useState<TemplateCollection[]>([]);

	const refreshCollections = useCallback(() => {
		if (typeof window === "undefined") return;
		setCollections(getTemplateCollections());
	}, []);

	useEffect(() => {
		refreshCollections();
	}, [refreshCollections]);

	const createCollection = useCallback(
		(name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return null;

			const collection = createTemplateCollection(trimmed);
			refreshCollections();
			return collection;
		},
		[refreshCollections],
	);

	const renameCollection = useCallback(
		(id: string, name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return undefined;

			const updatedCollection = renameTemplateCollection(id, trimmed);
			refreshCollections();
			return updatedCollection;
		},
		[refreshCollections],
	);

	const removeCollection = useCallback(
		(id: string) => {
			const result = deleteTemplateCollection(id);
			if (result) {
				refreshCollections();
			}
			return result;
		},
		[refreshCollections],
	);

	const addTemplate = useCallback(
		(collectionId: string, templateId: string) => {
			const updatedCollection = addTemplateToCollection(
				collectionId,
				templateId,
			);
			refreshCollections();
			return updatedCollection;
		},
		[refreshCollections],
	);

	const removeTemplate = useCallback(
		(collectionId: string, templateId: string) => {
			const updatedCollection = removeTemplateFromCollection(
				collectionId,
				templateId,
			);
			refreshCollections();
			return updatedCollection;
		},
		[refreshCollections],
	);

	const addCustomTemplate = useCallback(
		(collectionId: string, template: { name: string; code: string }) => {
			const customTemplate = addCustomTemplateToCollection(
				collectionId,
				template,
			);
			refreshCollections();
			return customTemplate;
		},
		[refreshCollections],
	);

	const removeCustomTemplate = useCallback(
		(collectionId: string, customTemplateId: string) => {
			const updatedCollection = removeCustomTemplateFromCollection(
				collectionId,
				customTemplateId,
			);
			refreshCollections();
			return updatedCollection;
		},
		[refreshCollections],
	);

	return {
		collections,
		createCollection,
		renameCollection,
		deleteCollection: removeCollection,
		addTemplate,
		removeTemplate,
		addCustomTemplate,
		removeCustomTemplate,
		refreshCollections,
	};
}
