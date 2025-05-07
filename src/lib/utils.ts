import { deflate, inflate } from "pako";

/**
 * Encodes a Mermaid code string into a compressed, base64 encoded string.
 * @param code The Mermaid code string to encode.
 * @returns The encoded string, or an empty string if the input code is empty.
 */
export function encodeMermaid(code: string): string {
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
 * Decodes a compressed, base64 encoded string back into a Mermaid code string.
 * @param encoded The encoded string to decode.
 * @returns The decoded Mermaid code string, or an empty string if decoding fails or the input is empty.
 */
export function decodeMermaid(encoded: string): string {
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
