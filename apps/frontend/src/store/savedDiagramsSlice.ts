import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk, RootState } from "./index";
import {
	deleteDiagram as deleteDiagramFromStorage,
	getAllDiagramsFromStorage,
	saveDiagramToStorage,
	type SavedDiagram,
} from "@/lib/indexed-db/diagrams.storage";
import { setCustomAlertMessage } from "./mermaidSlice";

export interface ImportedDiagramInput {
	name: string;
	code: string;
	timestamp: number;
}

interface SavedDiagramsState {
	items: SavedDiagram[];
	isLoading: boolean;
}

const initialState: SavedDiagramsState = {
	items: [],
	isLoading: false,
};

const savedDiagramsSlice = createSlice({
	name: "savedDiagrams",
	initialState,
	reducers: {
		setSavedDiagrams(state, action: PayloadAction<SavedDiagram[]>) {
			state.items = action.payload;
		},
		setSavedDiagramsLoading(state, action: PayloadAction<boolean>) {
			state.isLoading = action.payload;
		},
	},
});

export const { setSavedDiagrams, setSavedDiagramsLoading } =
	savedDiagramsSlice.actions;

export default savedDiagramsSlice.reducer;

export const selectSavedDiagrams = (state: RootState) =>
	state.savedDiagrams.items;
export const selectSavedDiagramsLoading = (state: RootState) =>
	state.savedDiagrams.isLoading;

export const refreshSavedDiagrams =
	(): AppThunk<Promise<void>> => async (dispatch) => {
		dispatch(setSavedDiagramsLoading(true));
		try {
			const diagrams = await getAllDiagramsFromStorage();
			dispatch(setSavedDiagrams(diagrams));
		} finally {
			dispatch(setSavedDiagramsLoading(false));
		}
	};

export const deleteSavedDiagram =
	(id: string): AppThunk<Promise<void>> =>
	async (dispatch) => {
		await deleteDiagramFromStorage(id);
		dispatch(setCustomAlertMessage("Diagram deleted"));
		dispatch(refreshSavedDiagrams());
	};

export const importSavedDiagrams =
	(diagrams: ImportedDiagramInput[]): AppThunk<Promise<void>> =>
	async (dispatch) => {
		if (!diagrams.length) return;
		for (const diagram of diagrams) {
			await saveDiagramToStorage(diagram.name, diagram.code, {
				timestamp: diagram.timestamp,
			});
		}
		dispatch(refreshSavedDiagrams());
		dispatch(
			setCustomAlertMessage(
				diagrams.length === 1
					? "Diagram imported"
					: `${diagrams.length} diagrams imported`,
			),
		);
	};
