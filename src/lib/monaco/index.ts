/**
 * Monaco Editor Configuration for Mermaid
 * Main entry point for Mermaid language support in Monaco Editor
 *
 * Features:
 * - Comprehensive syntax highlighting using Monarch tokenizer
 * - Intelligent autocomplete with context-aware suggestions
 * - Real-time syntax validation with 1000ms debounce
 * - Language configuration for brackets, indentation, and auto-closing
 * - Material-UI dark theme integration
 */

import { mermaidTokensProvider } from "./mermaid-tokens";
import { mermaidLanguageConfig } from "./mermaid-language";
import { mermaidCompletionProvider } from "./mermaid-completions";
import { setupMermaidValidation } from "./mermaid-validation";
import { mermaidHoverProvider } from "./mermaid-hover";

/**
 * Register Mermaid language with Monaco Editor
 * Call this function in the beforeMount callback of @monaco-editor/react
 *
 * @param monaco - Monaco editor instance
 * @returns Cleanup function to dispose resources
 */
export function registerMermaidLanguage(
	monaco: typeof import("monaco-editor"),
): () => void {
	// Register the Mermaid language
	monaco.languages.register({ id: "mermaid" });

	// Set language configuration (brackets, auto-closing, etc.)
	monaco.languages.setLanguageConfiguration("mermaid", mermaidLanguageConfig);

	// Set Monarch tokenizer for syntax highlighting
	monaco.languages.setMonarchTokensProvider("mermaid", mermaidTokensProvider);

	// Register completion provider
	const completionDisposable = monaco.languages.registerCompletionItemProvider(
		"mermaid",
		mermaidCompletionProvider,
	);
	const hoverDisposable = monaco.languages.registerHoverProvider(
		"mermaid",
		mermaidHoverProvider,
	);

	// Define custom theme colors based on Material-UI dark palette
	monaco.editor.defineTheme("mermaid-dark", {
		base: "vs-dark",
		inherit: true,
		rules: [
			// Keywords and diagram types
			{
				token: "keyword.diagram-type",
				foreground: "ce93d8",
				fontStyle: "bold",
			}, // Purple
			{ token: "keyword.direction", foreground: "ffa726", fontStyle: "bold" }, // Orange
			{ token: "keyword", foreground: "90caf9", fontStyle: "bold" }, // Blue

			// Node elements
			{ token: "node.id", foreground: "66bb6a" }, // Green
			{ token: "string.node-label", foreground: "fff9c4" }, // Light yellow
			{ token: "bracket.node", foreground: "9e9e9e" }, // Gray

			// Strings and text
			{ token: "string", foreground: "a5d6a7" }, // Light green
			{ token: "string.quote", foreground: "9e9e9e" }, // Gray
			{ token: "string.escape", foreground: "ffab91" }, // Light orange

			// Operators and links
			{ token: "operator.link", foreground: "29b6f6", fontStyle: "bold" }, // Cyan
			{
				token: "operator.relationship",
				foreground: "f48fb1",
				fontStyle: "bold",
			}, // Pink
			{ token: "operator", foreground: "81c784" }, // Light green

			// Comments and directives
			{ token: "comment", foreground: "616161", fontStyle: "italic" }, // Dark gray
			{ token: "directive", foreground: "ba68c8", fontStyle: "italic" }, // Light purple

			// Numbers and identifiers
			{ token: "number", foreground: "ffcc80" }, // Light orange
			{ token: "identifier", foreground: "e0e0e0" }, // Light gray

			// Delimiters
			{ token: "delimiter", foreground: "bdbdbd" }, // Gray
		],
		colors: {
			"editor.foreground": "#e0e0e0",
			"editor.background": "#121212",
			"editor.selectionBackground": "#264f78",
			"editor.lineHighlightBackground": "#1e1e1e",
			"editorCursor.foreground": "#90caf9",
			"editorWhitespace.foreground": "#424242",
		},
	});

	// Store validation cleanup functions for each model
	const validationCleanups = new Map<string, () => void>();

	// Setup validation for existing models and listen for new models
	const modelListener = monaco.editor.onDidCreateModel((model) => {
		if (model.getLanguageId() === "mermaid") {
			const cleanup = setupMermaidValidation(monaco, model);
			validationCleanups.set(model.uri.toString(), cleanup);
		}
	});

	// Cleanup validation when model is disposed
	const disposeListener = monaco.editor.onWillDisposeModel((model) => {
		const uri = model.uri.toString();
		const cleanup = validationCleanups.get(uri);
		if (cleanup) {
			cleanup();
			validationCleanups.delete(uri);
		}
	});

	// Setup validation for already existing models
	for (const model of monaco.editor.getModels()) {
		if (model.getLanguageId() === "mermaid") {
			const cleanup = setupMermaidValidation(monaco, model);
			validationCleanups.set(model.uri.toString(), cleanup);
		}
	}

	// Return cleanup function
	return () => {
		completionDisposable.dispose();
		hoverDisposable.dispose();
		modelListener.dispose();
		disposeListener.dispose();

		// Clean up all validation listeners
		for (const cleanup of validationCleanups.values()) {
			cleanup();
		}
		validationCleanups.clear();
	};
}

// Export all sub-modules for advanced usage
export { mermaidTokensProvider } from "./mermaid-tokens";
export { mermaidLanguageConfig } from "./mermaid-language";
export { mermaidCompletionProvider } from "./mermaid-completions";
export {
	setupMermaidValidation,
	validateMermaidCode,
} from "./mermaid-validation";
