/**
 * API Client for Backend Communication
 * Handles cookie-based auth sessions, request/response, and error handling
 */

import { appConfig } from "../config";
import type { ApiError } from "./types";

// Normalize base URL to avoid double slashes when concatenating endpoints
const API_URL = appConfig.api.baseUrl.replace(/\/+$/, "");

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
async function refreshAccessToken(): Promise<boolean> {
	try {
		const response = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

// Main API request function
export async function apiRequest<T>(
	endpoint: string,
	options: RequestOptions = {},
): Promise<T> {
	const normalizedEndpoint = endpoint.startsWith("/")
		? endpoint
		: `/${endpoint}`;
	const { body, skipAuth = false, ...fetchOptions } = options;

	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...options.headers,
	};

	const config: RequestInit = {
		...fetchOptions,
		headers,
		credentials: "include",
	};

	if (body !== undefined) {
		config.body = JSON.stringify(body);
	}

	let response = await fetch(`${API_URL}${normalizedEndpoint}`, config);

	// If unauthorized, try to refresh token
	if (response.status === 401 && !skipAuth) {
		const refreshed = await refreshAccessToken();
		if (refreshed) {
			response = await fetch(`${API_URL}${normalizedEndpoint}`, {
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
