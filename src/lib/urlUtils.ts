import { deflate, inflate } from "pako";

/**
 * Utility functions for handling URL parameters with encrypted Mermaid code
 */

/**
 * Encodes and encrypts the Mermaid code for use in URL
 * @param code The Mermaid diagram code to encode
 * @returns URL-safe encoded string
 */
export function encodeMermaidForUrl(code: string): string {
  if (!code) return "";
  // Compress the code using pako
  const compressed = deflate(code);
  // Convert Uint8Array to binary string
  let binaryString = "";
  for (let i = 0; i < compressed.length; i++) {
    binaryString += String.fromCharCode(compressed[i]);
  }
  // Base64 encode the binary string
  const encoded = btoa(binaryString);
  return encoded;
}

/**
 * Decodes the encrypted Mermaid code from URL
 * @param encoded The encoded string from URL
 * @returns Original Mermaid code
 */
export function decodeMermaidFromUrl(encoded: string): string {
  if (!encoded) return "";
  try {
    // Decode the base64 encoded string to binary string
    const binaryString = atob(encoded);
    // Convert binary string to Uint8Array
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed[i] = binaryString.charCodeAt(i);
    }
    // Decompress the data using pako
    return inflate(compressed, { to: "string" });
  } catch (error) {
    console.error("Failed to decode Mermaid code from URL:", error);
    return "";
  }
}

/**
 * Updates the browser URL with the encoded Mermaid code
 * @param code The Mermaid diagram code
 */
export function updateUrlWithMermaidCode(code: string): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (code) {
    url.searchParams.set("diagram", encodeMermaidForUrl(code));
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
  return decodeMermaidFromUrl(encoded);
}
