import pako from "pako";

const CHUNK_SIZE = 0x8000;

function uint8ArrayToBinaryString(data: Uint8Array): string {
	let result = "";
	for (let i = 0; i < data.length; i += CHUNK_SIZE) {
		const chunk = data.subarray(i, i + CHUNK_SIZE);
		result += String.fromCharCode(...chunk);
	}
	return result;
}

function binaryStringToUint8Array(str: string): Uint8Array {
	const buffer = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i += 1) {
		buffer[i] = str.charCodeAt(i);
	}
	return buffer;
}

// URL-safe base64 encoding (letters, numbers only)
function base64UrlEncode(input: string): string {
	return btoa(input)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");
}

function base64UrlDecode(input: string): string {
	let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
	// Pad with '=' to make length a multiple of 4
	while (base64.length % 4) base64 += "=";
	return atob(base64);
}

export function compressToBase64(payload: string): string {
	const compressed = pako.deflate(payload);
	const binary = uint8ArrayToBinaryString(compressed);
	return base64UrlEncode(binary);
}

export function decompressFromBase64(base64: string): string {
	const binary = base64UrlDecode(base64);
	const compressed = binaryStringToUint8Array(binary);
	return pako.inflate(compressed, { to: "string" });
}
