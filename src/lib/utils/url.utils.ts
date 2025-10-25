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

/**
 * Decodes Mermaid code from a provided encoded `diagram` query value.
 * Client-safe only (relies on browser base64 helpers via decodeMermaid).
 *
 * @param encoded Encoded diagram query value
 * @returns Decoded Mermaid code or empty string
 */
export function decodeDiagramCode(encoded: string | null | undefined): string {
	if (!encoded) return "";
	const trimmed = encoded.trim();
	if (!trimmed) return "";
	let normalised = trimmed
		.replace(/ /g, "+")
		.replace(/-/g, "+")
		.replace(/_/g, "/");
	const padding = normalised.length % 4;
	if (padding > 0) {
		normalised = normalised.padEnd(normalised.length + (4 - padding), "=");
	}
	return decompressFromBase64(normalised);
}
