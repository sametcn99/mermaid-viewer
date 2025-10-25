import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "./index";

interface PanelInstanceState {
	panelSize: number;
	isResizing: boolean;
}

export interface ResizablePanelsState {
	instances: Record<string, PanelInstanceState>;
}

const initialState: ResizablePanelsState = {
	instances: {},
};

const resizablePanelsSlice = createSlice({
	name: "resizablePanels",
	initialState,
	reducers: {
		initializePanel(
			state,
			action: PayloadAction<{ id: string; panelSize: number }>,
		) {
			const { id, panelSize } = action.payload;
			if (!state.instances[id]) {
				state.instances[id] = {
					panelSize,
					isResizing: false,
				};
			}
		},
		setPanelSize(
			state,
			action: PayloadAction<{ id: string; panelSize: number }>,
		) {
			const { id, panelSize } = action.payload;
			if (!state.instances[id]) {
				state.instances[id] = { panelSize, isResizing: false };
				return;
			}
			state.instances[id].panelSize = panelSize;
		},
		setPanelResizing(
			state,
			action: PayloadAction<{ id: string; isResizing: boolean }>,
		) {
			const { id, isResizing } = action.payload;
			if (!state.instances[id]) {
				state.instances[id] = { panelSize: 50, isResizing };
				return;
			}
			state.instances[id].isResizing = isResizing;
		},
		resetPanel(state, action: PayloadAction<{ id: string }>) {
			const { id } = action.payload;
			if (state.instances[id]) {
				delete state.instances[id];
			}
		},
	},
});

export const { initializePanel, setPanelSize, setPanelResizing, resetPanel } =
	resizablePanelsSlice.actions;

export default resizablePanelsSlice.reducer;

export const clampPanelSize =
	(params: {
		id: string;
		value: number;
		minSize: number;
		maxSize: number;
		isVertical: boolean;
	}): AppThunk =>
	(dispatch) => {
		const { id, value, minSize, maxSize, isVertical } = params;
		const actualMinSize = isVertical ? 0 : minSize;
		const actualMaxSize = isVertical ? 100 : maxSize;
		const clamped = Math.min(Math.max(value, actualMinSize), actualMaxSize);
		dispatch(setPanelSize({ id, panelSize: clamped }));
	};
