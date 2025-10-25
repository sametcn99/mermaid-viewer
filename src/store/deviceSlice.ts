import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "./index";

export interface ScreenState {
	isMobile: boolean;
	isTablet: boolean;
	width: number;
	height: number;
}

export interface DeviceState {
	isTouchDevice: boolean;
	screen: ScreenState;
}

const initialState: DeviceState = {
	isTouchDevice: false,
	screen: {
		isMobile: false,
		isTablet: false,
		width: 0,
		height: 0,
	},
};

const deviceSlice = createSlice({
	name: "device",
	initialState,
	reducers: {
		setIsTouchDevice(state, action: PayloadAction<boolean>) {
			state.isTouchDevice = action.payload;
		},
		setScreenState(state, action: PayloadAction<ScreenState>) {
			state.screen = action.payload;
		},
	},
});

export const { setIsTouchDevice, setScreenState } = deviceSlice.actions;

export default deviceSlice.reducer;

const checkTouchSupport = () => {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error - for older browsers
		navigator.msMaxTouchPoints > 0
	);
};

export const detectTouchDevice = (): AppThunk<boolean> => (dispatch) => {
	const supported = checkTouchSupport();
	dispatch(setIsTouchDevice(supported));
	return supported;
};

export const syncTouchDeviceFromMedia =
	(isMatch: boolean): AppThunk<boolean> =>
	(dispatch) => {
		const supported = isMatch || checkTouchSupport();
		dispatch(setIsTouchDevice(supported));
		return supported;
	};

export const measureScreenSize = (): AppThunk<ScreenState> => (dispatch) => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const screenState: ScreenState = {
		width,
		height,
		isMobile: width < 768,
		isTablet: width >= 768 && width < 1024,
	};
	dispatch(setScreenState(screenState));
	return screenState;
};
