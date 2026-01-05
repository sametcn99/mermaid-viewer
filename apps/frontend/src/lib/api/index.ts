/**
 * API Module Exports
 */

// Client
export { api, apiRequest, ApiRequestError } from "./client";
export {
	getAccessToken,
	getRefreshToken,
	setTokens,
	clearTokens,
	hasTokens,
} from "./client";

// Auth
export {
	register,
	login,
	logout,
	getCurrentUser,
	updateProfile,
	deleteAccount,
} from "./auth";

// Sync
export {
	syncDiagrams,
	syncTemplates,
	syncAi,
	syncSettings,
	fullSync,
} from "./sync";

// Types
export type * from "./types";
