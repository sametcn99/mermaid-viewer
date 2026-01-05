/**
 * API Client for Backend Communication
 * Handles authentication tokens, request/response, and error handling
 */

import type { ApiError, AuthTokens } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Token storage keys
const ACCESS_TOKEN_KEY = "mermaid-viewer-access-token";
const REFRESH_TOKEN_KEY = "mermaid-viewer-refresh-token";

// Token management
export function getAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasTokens(): boolean {
	return !!getAccessToken() && !!getRefreshToken();
}

// Request options type
interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	skipAuth?: boolean;
}

// Custom API Error class
export class ApiRequestError extends Error {
	public statusCode: number;
	public errorType?: string;

	constructor(message: string, statusCode: number, errorType?: string) {
		super(message);
		this.name = "ApiRequestError";
		this.statusCode = statusCode;
		this.errorType = errorType;
	}
}

// Token refresh function
async function refreshAccessToken(): Promise<string | null> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return null;

	try {
		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			clearTokens();
			return null;
		}

		const data = (await response.json()) as AuthTokens;
		setTokens(data);
		return data.accessToken;
	} catch {
		clearTokens();
		return null;
	}
}

// Main API request function
export async function apiRequest<T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	const { body, skipAuth = false, ...fetchOptions } = options;

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...options.headers,
	};

	// Add auth header if not skipped
	if (!skipAuth) {
		const accessToken = getAccessToken();
		if (accessToken) {
			(headers as Record<string, string>).Authorization =
				`Bearer ${accessToken}`;
		}
	}

	const config: RequestInit = {
		...fetchOptions,
		headers,
	};

	if (body !== undefined) {
		config.body = JSON.stringify(body);
	}

	let response = await fetch(`${API_URL}${endpoint}`, config);

	// If unauthorized, try to refresh token
	if (response.status === 401 && !skipAuth) {
		const newToken = await refreshAccessToken();
		if (newToken) {
			(headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
			response = await fetch(`${API_URL}${endpoint}`, {
				...config,
				headers,
			});
		}
	}

	// Handle non-JSON responses
	const contentType = response.headers.get("content-type");
	if (!contentType?.includes("application/json")) {
		if (!response.ok) {
			throw new ApiRequestError(
				`Request failed with status ${response.status}`,
				response.status,
			);
		}
		return {} as T;
	}

	const data = await response.json();

	if (!response.ok) {
		const error = data as ApiError;
		throw new ApiRequestError(
			error.message || "Request failed",
			response.status,
			error.error,
		);
	}

	return data as T;
}

// Convenience methods
export const api = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: "GET" }),

	post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: "POST", body }),

	put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

	patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

	delete: <T>(endpoint: string, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
