/**
 * Authentication API Functions
 */

import { api, clearTokens, setTokens } from "./client";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	UpdateProfileRequest,
	User,
} from "./types";

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
	const response = await api.post<AuthResponse>("/auth/register", data, {
		skipAuth: true,
	});
	setTokens({
		accessToken: response.accessToken,
		refreshToken: response.refreshToken,
	});
	return response;
}

/**
 * Login with email and password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
	const response = await api.post<AuthResponse>("/auth/login", data, {
		skipAuth: true,
	});
	setTokens({
		accessToken: response.accessToken,
		refreshToken: response.refreshToken,
	});
	return response;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
	try {
		await api.post("/auth/logout");
	} finally {
		clearTokens();
	}
}

/**
 * Get the current user profile
 */
export async function getCurrentUser(): Promise<User> {
	return api.get<User>("/auth/me");
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
	return api.patch<User>("/auth/profile", data);
}

/**
 * Delete user account
 */
export async function deleteAccount(password: string): Promise<void> {
	await api.delete("/auth/account", {
		body: { password },
	} as RequestInit & { body: unknown });
}
