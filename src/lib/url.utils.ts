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
  if (code) {
    url.searchParams.set("diagram", encodeMermaid(code));
  } else {
    url.searchParams.delete("diagram");
  }

  // Update the URL without forcing a navigation/refresh
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
