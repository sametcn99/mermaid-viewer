import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import debounce from "lodash.debounce";
import {
	findMatchingDiagramId,
	getAllDiagramsFromStorage,
	type SavedDiagram,
	updateDiagram,
	getDiagramById,
} from "@/lib/indexed-db/diagrams.storage";
import {
	updateBrowserUrlWithDiagramCode,
	retrieveDiagramCodeFromUrl,
} from "@/lib/utils/url.utils";
import type { AppDispatch, AppThunk, RootState } from "./index";

export interface MermaidState {
	mermaidCode: string;
	debouncedCode: string;
	hasUnsavedChanges: boolean;
	currentDiagramId?: string;
	openLoadDialog: boolean;
	alertMessage: string | null;
}

const initialState: MermaidState = {
	mermaidCode: "",
	debouncedCode: "",
	hasUnsavedChanges: false,
	currentDiagramId: undefined,
	openLoadDialog: false,
	alertMessage: null,
};

const mermaidSlice = createSlice({
	name: "mermaid",
	initialState,
	reducers: {
		setMermaidCode(state, action: PayloadAction<string>) {
			state.mermaidCode = action.payload;
		},
		setDebouncedCode(state, action: PayloadAction<string>) {
			state.debouncedCode = action.payload;
		},
		setHasUnsavedChanges(state, action: PayloadAction<boolean>) {
			state.hasUnsavedChanges = action.payload;
		},
		setCurrentDiagramId(state, action: PayloadAction<string | undefined>) {
			state.currentDiagramId = action.payload;
		},
		setOpenLoadDialog(state, action: PayloadAction<boolean>) {
			state.openLoadDialog = action.payload;
		},
		setAlertMessage(state, action: PayloadAction<string | null>) {
			state.alertMessage = action.payload;
		},
		resetMermaidState() {
			return { ...initialState };
		},
	},
});

export const {
	setMermaidCode,
	setDebouncedCode,
	setHasUnsavedChanges,
	setCurrentDiagramId,
	setOpenLoadDialog,
	setAlertMessage,
	resetMermaidState,
} = mermaidSlice.actions;

export default mermaidSlice.reducer;

const dispatchDebouncedCode = debounce(
	(dispatch: AppDispatch, code: string) => {
		dispatch(setDebouncedCode(code));
	},
	300,
);

const getCurrentDiagram = async (
	state: RootState,
): Promise<SavedDiagram | undefined> => {
	const { currentDiagramId } = state.mermaid;
	if (!currentDiagramId) return undefined;
	return getDiagramById(currentDiagramId);
};

export const initializeMermaidState =
	(): AppThunk<Promise<void>> => async (dispatch, getState) => {
		const codeFromUrl = retrieveDiagramCodeFromUrl();

		if (codeFromUrl) {
			dispatch(setMermaidCode(codeFromUrl));
			dispatch(setDebouncedCode(codeFromUrl));
			const matchedId = await findMatchingDiagramId(codeFromUrl);
			if (matchedId) {
				dispatch(setCurrentDiagramId(matchedId));
				dispatch(setHasUnsavedChanges(false));
			}
			return;
		}

		const savedDiagrams = await getAllDiagramsFromStorage();
		const isAuthenticated = getState().auth.isAuthenticated;
		if (savedDiagrams.length > 0 && isAuthenticated) {
			dispatch(setLoadDialogOpen(true));
			return;
		}

		// No diagram in URL and no saved diagrams — leave editor empty.
		// Previously we automatically created/loaded an example diagram here.
		// To respect user's request, do not auto-create a diagram on initial visit.
		return;
	};

export const updateMermaidFromEditor =
	(value: string | undefined): AppThunk<Promise<void>> =>
	async (dispatch, getState) => {
		const newCode = value || "";
		dispatch(setMermaidCode(newCode));
		dispatchDebouncedCode(dispatch, newCode);

		const state = getState();
		const currentDiagram = await getCurrentDiagram(state);

		if (currentDiagram) {
			const hasChanged = currentDiagram.code !== newCode;
			dispatch(setHasUnsavedChanges(hasChanged));
		} else {
			const changed = newCode !== "";
			dispatch(setHasUnsavedChanges(changed));
		}
	};

export const loadDiagramFromStorage =
	(diagram: SavedDiagram): AppThunk =>
	(dispatch) => {
		dispatch(setMermaidCode(diagram.code));
		dispatch(setDebouncedCode(diagram.code));
		dispatch(setCurrentDiagramId(diagram.id));
		updateBrowserUrlWithDiagramCode(diagram.code);
		dispatch(setHasUnsavedChanges(false));
		dispatch(setOpenLoadDialog(false));
		dispatch(setAlertMessage(`Loaded diagram: ${diagram.name}`));
	};

export const createNewDiagram = (): AppThunk => (dispatch) => {
	dispatch(resetMermaidState());
	dispatch(setMermaidCode(""));
	dispatch(setDebouncedCode(""));
	dispatch(setCurrentDiagramId(undefined));
	updateBrowserUrlWithDiagramCode("");
	dispatch(setHasUnsavedChanges(false));
	dispatch(setOpenLoadDialog(false));
	dispatch(setAlertMessage(null));
	dispatch(setAlertMessage("Created new diagram"));
};

export const saveDiagramChanges =
	(diagramId: string | undefined): AppThunk<Promise<void>> =>
	async (dispatch, getState) => {
		if (!diagramId) return;
		const { mermaidCode } = getState().mermaid;
		const updated = await updateDiagram(diagramId, { code: mermaidCode });
		if (updated) {
			dispatch(setHasUnsavedChanges(false));
			dispatch(setAlertMessage("Diagram updated"));
		}
	};

export const selectTemplateDiagram =
	(params: { code: string; name: string }): AppThunk =>
	(dispatch) => {
		const { code, name } = params;
		dispatch(setMermaidCode(code));
		dispatch(setDebouncedCode(code));
		dispatch(setCurrentDiagramId(undefined));
		updateBrowserUrlWithDiagramCode(code);
		dispatch(setHasUnsavedChanges(true));
		dispatch(setAlertMessage(`Template loaded: ${name}`));
	};

export const closeLoadDialog = (): AppThunk => (dispatch) => {
	dispatch(setOpenLoadDialog(false));
	// Intentionally do not auto-create a diagram when load dialog is closed.
	// Keep the editor state as-is (which will usually be empty).
};

export const dismissMermaidAlert = (): AppThunk => (dispatch) => {
	dispatch(setAlertMessage(null));
};

export const setLoadDialogOpen =
	(open: boolean): AppThunk =>
	(dispatch, getState) => {
		const { auth } = getState();
		if (open && !auth.isAuthenticated) {
			dispatch(setAlertMessage("Sign in to view saved diagrams."));
			if (typeof window !== "undefined") {
				window.dispatchEvent(
					new CustomEvent("requestAuthentication", {
						detail: { message: "Sign in to view saved diagrams." },
					}),
				);
			}
			return;
		}

		dispatch(setOpenLoadDialog(open));
	};

export const setCustomAlertMessage =
	(message: string | null): AppThunk =>
	(dispatch) => {
		dispatch(setAlertMessage(message));
	};

export const setCustomCurrentDiagramId =
	(id: string | undefined): AppThunk =>
	(dispatch) => {
		dispatch(setCurrentDiagramId(id));
	};

export const setCustomUnsavedChanges =
	(changed: boolean): AppThunk =>
	(dispatch) => {
		dispatch(setHasUnsavedChanges(changed));
	};

export const cancelMermaidDebounce = (): AppThunk => () => {
	dispatchDebouncedCode.cancel();
};
