import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import {
	login as apiLogin,
	register as apiRegister,
	logout as apiLogout,
	getCurrentUser,
	updateProfile as apiUpdateProfile,
	hasTokens,
	type User,
	type LoginRequest,
	type RegisterRequest,
	type UpdateProfileRequest,
	ApiRequestError,
} from "@/lib/api";
import { performFullSync, clearLocalSyncData } from "@/lib/sync";

const LOCAL_MODE_STORAGE_KEY = "mermaid-viewer-auth-mode";
const LOCAL_MODE_STORAGE_VALUE = "local-only";

const readLocalModePreference = (): boolean => {
	if (typeof window === "undefined") return false;
	return (
		window.localStorage.getItem(LOCAL_MODE_STORAGE_KEY) ===
		LOCAL_MODE_STORAGE_VALUE
	);
};

const persistLocalModePreference = (enabled: boolean) => {
	if (typeof window === "undefined") return;
	if (enabled) {
		window.localStorage.setItem(
			LOCAL_MODE_STORAGE_KEY,
			LOCAL_MODE_STORAGE_VALUE,
		);
		return;
	}
	window.localStorage.removeItem(LOCAL_MODE_STORAGE_KEY);
};

type InitializeAuthResult = { user: User | null; isLocalOnly: boolean };
type InitializeAuthError = { message: string; isLocalOnly: boolean };

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLocalOnly: boolean;
	isLoading: boolean;
	isInitialized: boolean;
	error: string | null;
	lastSyncAt: number | null;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLocalOnly: false,
	isLoading: false,
	isInitialized: false,
	error: null,
	lastSyncAt: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk<
	InitializeAuthResult,
	void,
	{ rejectValue: InitializeAuthError }
>(
	"auth/initialize",
	async (_, { rejectWithValue }) => {
		try {
			const isLocalOnly = readLocalModePreference();
			if (!hasTokens()) {
				return { user: null, isLocalOnly } satisfies InitializeAuthResult;
			}
			const user = await getCurrentUser();
			persistLocalModePreference(false);
			return { user, isLocalOnly: false } satisfies InitializeAuthResult;
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return rejectWithValue({
					message: error.message,
					isLocalOnly: readLocalModePreference(),
				} satisfies InitializeAuthError);
			}
			return rejectWithValue({
				message: "Failed to initialize auth",
				isLocalOnly: readLocalModePreference(),
			} satisfies InitializeAuthError);
		}
	},
);

export const login = createAsyncThunk(
	"auth/login",
	async (credentials: LoginRequest, { rejectWithValue }) => {
		try {
			const response = await apiLogin(credentials);
			persistLocalModePreference(false);
			return response.user;
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("Login failed");
		}
	},
);

export const register = createAsyncThunk(
	"auth/register",
	async (data: RegisterRequest, { rejectWithValue }) => {
		try {
			const response = await apiRegister(data);
			persistLocalModePreference(false);
			return response.user;
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("Registration failed");
		}
	},
);

export const logout = createAsyncThunk(
	"auth/logout",
	async (_, { getState }) => {
		const state = getState() as { auth: AuthState };
		const wasAuthenticated = state.auth.isAuthenticated && hasTokens();

		let syncCompleted = false;
		if (wasAuthenticated) {
			try {
				await performFullSync();
				syncCompleted = true;
			} catch (error) {
				console.error("Full sync before logout failed:", error);
			}
		}

		try {
			await apiLogout();
		} catch (error) {
			console.error("Logout error:", error);
		}

		persistLocalModePreference(false);

		if (wasAuthenticated && syncCompleted) {
			try {
				await clearLocalSyncData();
			} catch (error) {
				console.error("Failed to clear local sync data:", error);
			}
		}
	},
);

export const continueWithLocalMode = createAsyncThunk(
	"auth/continueWithLocalMode",
	async () => {
		persistLocalModePreference(true);
		return true;
	},
);

export const updateProfile = createAsyncThunk(
	"auth/updateProfile",
	async (data: UpdateProfileRequest, { rejectWithValue }) => {
		try {
			const user = await apiUpdateProfile(data);
			return user;
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("Profile update failed");
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setLastSyncAt: (state, action: PayloadAction<number>) => {
			state.lastSyncAt = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Initialize auth
		builder
			.addCase(initializeAuth.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(initializeAuth.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isInitialized = true;
				state.isLocalOnly = action.payload.isLocalOnly;
				if (action.payload.user) {
					state.user = action.payload.user;
					state.isAuthenticated = true;
					state.isLocalOnly = false;
				}
			})
			.addCase(initializeAuth.rejected, (state, action) => {
				state.isLoading = false;
				state.isInitialized = true;
				state.user = null;
				state.isAuthenticated = false;
				state.isLocalOnly = action.payload?.isLocalOnly ?? false;
				// Don't show error for initialization failures - just not logged in
			});

		// Login
		builder
			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
				state.isAuthenticated = true;
				state.isLocalOnly = false;
				state.error = null;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		// Register
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
				state.isAuthenticated = true;
				state.isLocalOnly = false;
				state.error = null;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});

		// Logout
		builder
			.addCase(logout.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(logout.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.isLocalOnly = false;
				state.lastSyncAt = null;
				state.error = null;
			})
			.addCase(logout.rejected, (state) => {
				// Clear state even on failure
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.isLocalOnly = false;
				state.lastSyncAt = null;
			});

		// Continue with local storage
		builder.addCase(continueWithLocalMode.fulfilled, (state) => {
			state.isLocalOnly = true;
			state.isAuthenticated = false;
			state.user = null;
			state.isInitialized = true;
			state.isLoading = false;
			state.error = null;
			state.lastSyncAt = null;
		});

		// Update profile
		builder
			.addCase(updateProfile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload;
				state.error = null;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearError, setLastSyncAt } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
	state.auth.isAuthenticated;
export const selectIsLocalOnly = (state: { auth: AuthState }) =>
	state.auth.isLocalOnly;
export const selectCanUseLocalData = (state: { auth: AuthState }) =>
	state.auth.isAuthenticated || state.auth.isLocalOnly;
export const selectAuthLoading = (state: { auth: AuthState }) =>
	state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthInitialized = (state: { auth: AuthState }) =>
	state.auth.isInitialized;
export const selectLastSyncAt = (state: { auth: AuthState }) =>
	state.auth.lastSyncAt;

export default authSlice.reducer;
