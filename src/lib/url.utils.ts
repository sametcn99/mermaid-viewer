/**
 * Utility functions for handling URL parameters with encrypted Mermaid code
 */

import { decodeMermaid, encodeMermaid } from "./utils";

/**
 * Updates the browser URL with the encoded Mermaid code
 * @param code The Mermaid diagram code
 */
export function updateUrlWithMermaidCode(code: string): void {
	if (typeof window === "undefined") return;
	const url = new URL(window.location.href);
	if (code) url.searchParams.set("diagram", encodeMermaid(code));
	else url.searchParams.delete("diagram");
	window.history.replaceState({}, "", url.toString());
}

/**
 * Retrieves Mermaid code from URL if present
 * @returns The decoded Mermaid code or empty string
 */
export function getMermaidCodeFromUrl(): string {
	if (typeof window === "undefined") return "";
	const url = new URL(window.location.href);
	const encoded = url.searchParams.get("diagram");
	if (!encoded) return "";
	return decodeMermaid(encoded);
}

/**
 * Decodes Mermaid code from a provided encoded `diagram` query value.
 * Client-safe only (relies on browser base64 helpers via decodeMermaid).
 *
 * @param encoded Encoded diagram query value
 * @returns Decoded Mermaid code or empty string
 */
export function getMermaidCodeFromEncoded(
	encoded: string | null | undefined,
): string {
	if (!encoded) return "";
	const trimmed = encoded.trim();
	if (!trimmed) return "";
	// Normalise potential URL-safe variants and stray spaces from query parsing
	let normalised = trimmed.replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
	const padding = normalised.length % 4;
	if (padding > 0) {
		normalised = normalised.padEnd(normalised.length + (4 - padding), "=");
	}
	return decodeMermaid(normalised);
}
