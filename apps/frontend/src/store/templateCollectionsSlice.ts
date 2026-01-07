import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	CustomTemplate,
	TemplateCollection,
} from "@/lib/indexed-db/templates.storage";
import {
	addTemplateToCollection,
	addCustomTemplateToCollection,
	createTemplateCollection,
	deleteTemplateCollection,
	getTemplateCollections,
	removeCustomTemplateFromCollection,
	removeTemplateFromCollection,
	renameTemplateCollection,
} from "@/lib/indexed-db/templates.storage";
import { requestImmediateSync } from "@/lib/sync";
import type { AppThunk } from "./index";

export interface TemplateCollectionsState {
	collections: TemplateCollection[];
	isInitialized: boolean;
}

const initialState: TemplateCollectionsState = {
	collections: [],
	isInitialized: false,
};

const templateCollectionsSlice = createSlice({
	name: "templateCollections",
	initialState,
	reducers: {
		setCollections(state, action: PayloadAction<TemplateCollection[]>) {
			state.collections = action.payload;
		},
		setInitialized(state, action: PayloadAction<boolean>) {
			state.isInitialized = action.payload;
		},
	},
});

export const { setCollections, setInitialized } =
	templateCollectionsSlice.actions;

export default templateCollectionsSlice.reducer;

export const refreshTemplateCollections =
	(): AppThunk<Promise<void>> => async (dispatch) => {
		if (typeof window === "undefined") return;
		const collections = await getTemplateCollections();
		dispatch(setCollections(collections));
		dispatch(setInitialized(true));
	};

export const createTemplateCollectionThunk =
	(name: string): AppThunk<Promise<TemplateCollection | null>> =>
	async (dispatch) => {
		const trimmed = name.trim();
		if (!trimmed) return null;
		const collection = await createTemplateCollection(trimmed);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("template-collection-created");
		return collection;
	};

export const renameTemplateCollectionThunk =
	(
		id: string,
		name: string,
	): AppThunk<Promise<TemplateCollection | undefined>> =>
	async (dispatch) => {
		const trimmed = name.trim();
		if (!trimmed) return undefined;
		const updated = await renameTemplateCollection(id, trimmed);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("template-collection-renamed");
		return updated;
	};

export const deleteTemplateCollectionThunk =
	(id: string): AppThunk<Promise<boolean>> =>
	async (dispatch) => {
		const result = await deleteTemplateCollection(id);
		if (result) {
			await dispatch(refreshTemplateCollections());
			requestImmediateSync("template-collection-deleted");
		}
		return result;
	};

export const addTemplateToCollectionThunk =
	(
		collectionId: string,
		templateId: string,
	): AppThunk<Promise<TemplateCollection | undefined>> =>
	async (dispatch) => {
		const updated = await addTemplateToCollection(collectionId, templateId);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("template-added-to-collection");
		return updated;
	};

export const removeTemplateFromCollectionThunk =
	(
		collectionId: string,
		templateId: string,
	): AppThunk<Promise<TemplateCollection | undefined>> =>
	async (dispatch) => {
		const updated = await removeTemplateFromCollection(
			collectionId,
			templateId,
		);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("template-removed-from-collection");
		return updated;
	};

export const addCustomTemplateToCollectionThunk =
	(
		collectionId: string,
		template: { name: string; code: string },
	): AppThunk<Promise<CustomTemplate | undefined>> =>
	async (dispatch) => {
		const customTemplate = await addCustomTemplateToCollection(
			collectionId,
			template,
		);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("custom-template-added");
		return customTemplate;
	};

export const removeCustomTemplateFromCollectionThunk =
	(
		collectionId: string,
		customTemplateId: string,
	): AppThunk<Promise<TemplateCollection | undefined>> =>
	async (dispatch) => {
		const updated = await removeCustomTemplateFromCollection(
			collectionId,
			customTemplateId,
		);
		await dispatch(refreshTemplateCollections());
		requestImmediateSync("custom-template-removed");
		return updated;
	};
