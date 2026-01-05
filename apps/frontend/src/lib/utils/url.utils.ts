import { compressToBase64, decompressFromBase64 } from "./compression.utils";

const DIAGRAM_PARAM = "diagram";
const SETTINGS_PARAM = "settings";
const URL_UPDATE_EVENT = "mermaidUrlUpdated";

const EMPTY_STATE = "{}";

function notifyUrlUpdated(url: URL) {

	window.history.replaceState({}, "", url.toString());
	window.dispatchEvent(new CustomEvent(URL_UPDATE_EVENT));
}

function setSearchParam(url: URL, key: string, value: string | null) {
	if (value && value.length > 0) {
		url.searchParams.set(key, value);
	} else {
		url.searchParams.delete(key);
	}
}

/**
 * Updates the browser URL with the encoded Mermaid code
 * @param code The Mermaid diagram code
 */
export function updateBrowserUrlWithDiagramCode(code: string): void {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	if (code) setSearchParam(url, DIAGRAM_PARAM, compressToBase64(code));
	else url.searchParams.delete(DIAGRAM_PARAM);
	notifyUrlUpdated(url);
}

/**
 * Retrieves Mermaid code from URL if present
 * @returns The decoded Mermaid code or empty string
 */
export function retrieveDiagramCodeFromUrl(): string {
	if (typeof window === "undefined") return "";
	const url = new URL(window.location.href);
	const encoded = url.searchParams.get(DIAGRAM_PARAM);
	if (!encoded) return "";
	return decompressFromBase64(encoded);
}

function serializeSettings(settings: unknown): string | null {
	if (!settings) return null;
	try {
		const serialized = JSON.stringify(settings);
		if (!serialized || serialized === EMPTY_STATE) return null;
		return compressToBase64(serialized);
	} catch (error) {
		console.error("Failed to serialize diagram settings for URL", error);
		return null;
	}
}

export function updateBrowserUrlWithDiagramSettings(settings: unknown): void {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	const encoded = serializeSettings(settings);
	if (encoded) setSearchParam(url, SETTINGS_PARAM, encoded);
	else url.searchParams.delete(SETTINGS_PARAM);
	notifyUrlUpdated(url);
}

export function retrieveDiagramSettingsFromUrl<T>(
	defaultValue: T | null = null,
): T | null {
	if (typeof window === "undefined") return defaultValue;
	const url = new URL(window.location.href);
	const encoded = url.searchParams.get(SETTINGS_PARAM);
	if (!encoded) return defaultValue;
	try {
		const json = decompressFromBase64(encoded);
		return JSON.parse(json) as T;
	} catch (error) {
		console.error("Failed to parse diagram settings from URL", error);
		return defaultValue;
	}
}

export function subscribeToUrlUpdates(callback: () => void): () => void {
	if (typeof window === "undefined") return () => undefined;
	const handler = () => callback();
	window.addEventListener(URL_UPDATE_EVENT, handler);
	window.addEventListener("popstate", handler);
	return () => {
		window.removeEventListener(URL_UPDATE_EVENT, handler);
		window.removeEventListener("popstate", handler);
	};
}
