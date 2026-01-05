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

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isInitialized: boolean;
	error: string | null;
	lastSyncAt: number | null;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: false,
	isInitialized: false,
	error: null,
	lastSyncAt: null,
};

// Async thunks
export const initializeAuth = createAsyncThunk(
	"auth/initialize",
	async (_, { rejectWithValue }) => {
		try {
			if (!hasTokens()) {
				return null;
			}
			const user = await getCurrentUser();
			return user;
		} catch (error) {
			if (error instanceof ApiRequestError) {
				return rejectWithValue(error.message);
			}
			return rejectWithValue("Failed to initialize auth");
		}
	},
);

export const login = createAsyncThunk(
	"auth/login",
	async (credentials: LoginRequest, { rejectWithValue }) => {
		try {
			const response = await apiLogin(credentials);
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

		if (wasAuthenticated && syncCompleted) {
			try {
				await clearLocalSyncData();
			} catch (error) {
				console.error("Failed to clear local sync data:", error);
			}
		}
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
				if (action.payload) {
					state.user = action.payload;
					state.isAuthenticated = true;
				}
			})
			.addCase(initializeAuth.rejected, (state, action) => {
				state.isLoading = false;
				state.isInitialized = true;
				state.user = null;
				state.isAuthenticated = false;
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
				state.lastSyncAt = null;
				state.error = null;
			})
			.addCase(logout.rejected, (state) => {
				// Clear state even on failure
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
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
export const selectAuthLoading = (state: { auth: AuthState }) =>
	state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthInitialized = (state: { auth: AuthState }) =>
	state.auth.isInitialized;
export const selectLastSyncAt = (state: { auth: AuthState }) =>
	state.auth.lastSyncAt;

export default authSlice.reducer;
