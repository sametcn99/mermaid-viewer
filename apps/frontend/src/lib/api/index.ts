/**
 * API Module Exports
 */

// Auth
export {
	deleteAccount,
	getCurrentUser,
	login,
	logout,
	register,
	updateProfile,
} from "./auth";
// Client
export {
	ApiRequestError,
	api,
	apiRequest,
	clearTokens,
	getAccessToken,
	getRefreshToken,
	hasTokens,
	setTokens,
} from "./client";

// Sync
export {
	fullSync,
	syncDiagrams,
	syncSettings,
	syncTemplates,
} from "./sync";

// Types
export type * from "./types";
