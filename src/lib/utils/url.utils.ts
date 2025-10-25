import { compressToBase64, decompressFromBase64 } from "./compression.utils";

/**
 * Updates the browser URL with the encoded Mermaid code
 * @param code The Mermaid diagram code
 */
export function updateBrowserUrlWithDiagramCode(code: string): void {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	if (code) url.searchParams.set("diagram", compressToBase64(code));
	else url.searchParams.delete("diagram");
	window.history.replaceState({}, "", url.toString());
}

/**
 * Retrieves Mermaid code from URL if present
 * @returns The decoded Mermaid code or empty string
 */
export function retrieveDiagramCodeFromUrl(): string {
	if (typeof window === "undefined") return "";
	const url = new URL(window.location.href);
	const encoded = url.searchParams.get("diagram");
	if (!encoded) return "";
	return decompressFromBase64(encoded);
}
