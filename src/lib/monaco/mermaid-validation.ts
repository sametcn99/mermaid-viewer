/**
 * Monaco Validation Provider for Mermaid
 * Provides real-time syntax validation using Mermaid parser
 * Debounced at 1000ms to avoid excessive validation calls
 */

import type * as monaco from "monaco-editor";
import mermaid from "mermaid";

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Validate Mermaid syntax and return Monaco markers
 */
async function validateMermaidSyntax(
	code: string,
): Promise<monaco.editor.IMarkerData[]> {
	if (!code.trim()) {
		return [];
	}

	try {
		// Use Mermaid's parse function to validate syntax
		await mermaid.parse(code, { suppressErrors: true });
		return [];
	} catch (error: any) {
		// Parse error and create marker
		const markers: monaco.editor.IMarkerData[] = [];

		// Extract error information
		const errorMessage = error?.message || error?.str || "Syntax error";
		const errorHash = error?.hash;

		let line = 1;
		let column = 1;
		let endLine = 1;
		let endColumn = 1;

		// Try to extract line and column information from error
		if (errorHash) {
			if (errorHash.line !== undefined) {
				line = errorHash.line;
				endLine = errorHash.line;
			}
			if (errorHash.loc) {
				if (errorHash.loc.first_line !== undefined) {
					line = errorHash.loc.first_line;
				}
				if (errorHash.loc.last_line !== undefined) {
					endLine = errorHash.loc.last_line;
				}
				if (errorHash.loc.first_column !== undefined) {
					column = errorHash.loc.first_column + 1;
				}
				if (errorHash.loc.last_column !== undefined) {
					endColumn = errorHash.loc.last_column + 2;
				}
			}
		}

		// Try to extract line from error message
		const lineMatch = errorMessage.match(/line (\d+)/i);
		if (lineMatch) {
			line = Number.parseInt(lineMatch[1], 10);
			endLine = line;
		}

		// Ensure valid line and column numbers
		const lines = code.split("\n");
		line = Math.max(1, Math.min(line, lines.length));
		endLine = Math.max(line, Math.min(endLine, lines.length));

		if (lines[line - 1]) {
			const lineLength = lines[line - 1].length;
			column = Math.max(1, Math.min(column, lineLength + 1));
			endColumn = Math.max(column, Math.min(endColumn, lineLength + 1));
		}

		// Create helpful error message
		let message = errorMessage;
		const expectedToken = errorHash?.expected;
		if (expectedToken && Array.isArray(expectedToken) && expectedToken.length > 0) {
			message += `\nExpected: ${expectedToken.slice(0, 5).join(", ")}`;
		}

		// Extract token text if available
		if (errorHash?.text) {
			message += `\nFound: '${errorHash.text}'`;
		}

		markers.push({
			severity: 8, // Error severity (8 = Error, 4 = Warning, 2 = Info, 1 = Hint)
			startLineNumber: line,
			startColumn: column,
			endLineNumber: endLine,
			endColumn: endColumn,
			message: message,
			source: "mermaid",
		});

		return markers;
	}
}

/**
 * Setup validation for a Monaco editor model
 */
export function setupMermaidValidation(
	monaco: typeof import("monaco-editor"),
	model: monaco.editor.ITextModel,
): () => void {
	// Create debounced validation function
	const debouncedValidate = debounce(async () => {
		const code = model.getValue();
		const markers = await validateMermaidSyntax(code);
		monaco.editor.setModelMarkers(model, "mermaid", markers);
	}, 1000); // 1000ms debounce

	// Validate on content change
	const disposable = model.onDidChangeContent(() => {
		debouncedValidate();
	});

	// Initial validation
	debouncedValidate();

	// Return cleanup function
	return () => {
		disposable.dispose();
		monaco.editor.setModelMarkers(model, "mermaid", []);
	};
}

/**
 * Validate Mermaid code and return validation result
 * Useful for external validation checks
 */
export async function validateMermaidCode(code: string): Promise<{
	valid: boolean;
	errors: Array<{
		line: number;
		column: number;
		message: string;
	}>;
}> {
	const markers = await validateMermaidSyntax(code);

	return {
		valid: markers.length === 0,
		errors: markers.map((marker) => ({
			line: marker.startLineNumber,
			column: marker.startColumn,
			message: marker.message,
		})),
	};
}
