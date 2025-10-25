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

export function compressToBase64(payload: string): string {
	const compressed = pako.deflate(payload);
	const binary = uint8ArrayToBinaryString(compressed);
	return btoa(binary);
}

export function decompressFromBase64(base64: string): string {
	const binary = atob(base64);
	const compressed = binaryStringToUint8Array(binary);
	return pako.inflate(compressed, { to: "string" });
}
