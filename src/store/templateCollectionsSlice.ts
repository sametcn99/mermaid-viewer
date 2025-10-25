import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	CustomTemplate,
	TemplateCollection,
} from "@/lib/utils/local-storage/templates.storage";
import {
	addTemplateToCollection,
	addCustomTemplateToCollection,
	createTemplateCollection,
	deleteTemplateCollection,
	getTemplateCollections,
	removeCustomTemplateFromCollection,
	removeTemplateFromCollection,
	renameTemplateCollection,
} from "@/lib/utils/local-storage/templates.storage";
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

export const refreshTemplateCollections = (): AppThunk => (dispatch) => {
	if (typeof window === "undefined") return;
	const collections = getTemplateCollections();
	dispatch(setCollections(collections));
	dispatch(setInitialized(true));
};

export const createTemplateCollectionThunk =
	(name: string): AppThunk<TemplateCollection | null> =>
	(dispatch) => {
		const trimmed = name.trim();
		if (!trimmed) return null;
		const collection = createTemplateCollection(trimmed);
		dispatch(refreshTemplateCollections());
		return collection;
	};

export const renameTemplateCollectionThunk =
	(id: string, name: string): AppThunk<TemplateCollection | undefined> =>
	(dispatch) => {
		const trimmed = name.trim();
		if (!trimmed) return undefined;
		const updated = renameTemplateCollection(id, trimmed);
		dispatch(refreshTemplateCollections());
		return updated;
	};

export const deleteTemplateCollectionThunk =
	(id: string): AppThunk<boolean> =>
	(dispatch) => {
		const result = deleteTemplateCollection(id);
		if (result) {
			dispatch(refreshTemplateCollections());
		}
		return result;
	};

export const addTemplateToCollectionThunk =
	(
		collectionId: string,
		templateId: string,
	): AppThunk<TemplateCollection | undefined> =>
	(dispatch) => {
		const updated = addTemplateToCollection(collectionId, templateId);
		dispatch(refreshTemplateCollections());
		return updated;
	};

export const removeTemplateFromCollectionThunk =
	(
		collectionId: string,
		templateId: string,
	): AppThunk<TemplateCollection | undefined> =>
	(dispatch) => {
		const updated = removeTemplateFromCollection(collectionId, templateId);
		dispatch(refreshTemplateCollections());
		return updated;
	};

export const addCustomTemplateToCollectionThunk =
	(
		collectionId: string,
		template: { name: string; code: string },
	): AppThunk<CustomTemplate | undefined> =>
	(dispatch) => {
		const customTemplate = addCustomTemplateToCollection(
			collectionId,
			template,
		);
		dispatch(refreshTemplateCollections());
		return customTemplate;
	};

export const removeCustomTemplateFromCollectionThunk =
	(
		collectionId: string,
		customTemplateId: string,
	): AppThunk<TemplateCollection | undefined> =>
	(dispatch) => {
		const updated = removeCustomTemplateFromCollection(
			collectionId,
			customTemplateId,
		);
		dispatch(refreshTemplateCollections());
		return updated;
	};
