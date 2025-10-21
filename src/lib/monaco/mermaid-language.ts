/**
 * Monaco Language Configuration for Mermaid
 * Defines language behavior for auto-closing, indentation, brackets, etc.
 */

import type * as monaco from "monaco-editor";

export const mermaidLanguageConfig: monaco.languages.LanguageConfiguration = {
	comments: {
		lineComment: "%%",
	},

	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
	],

	autoClosingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: "|", close: "|" },
	],

	surroundingPairs: [
		{ open: "{", close: "}" },
		{ open: "[", close: "]" },
		{ open: "(", close: ")" },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: "|", close: "|" },
		{ open: "<", close: ">" },
	],

	// Define what happens when Enter is pressed
	onEnterRules: [
		{
			// Indent after subgraph or other block-starting keywords
			beforeText: /^\s*(subgraph|alt|loop|opt|par|rect|critical|break)\b.*$/,
			action: { indentAction: 1 }, // 1 = Indent
		},
		{
			// Outdent on 'end' keyword
			beforeText: /^\s*end\s*$/,
			action: { indentAction: 2 }, // 2 = Outdent
		},
		{
			// Keep indent for section in gantt charts
			beforeText: /^\s*section\b.*$/,
			action: { indentAction: 1 },
		},
	],

	// Indentation rules
	indentationRules: {
		increaseIndentPattern:
			/^\s*(subgraph|alt|loop|opt|par|rect|critical|break|section|namespace|state|class)\b/,
		decreaseIndentPattern: /^\s*end\s*$/,
	},

	// Word pattern for word-related editor features
	wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,

	// Folding rules
	folding: {
		markers: {
			start:
				/^\s*(subgraph|alt|loop|opt|par|rect|critical|break|section|namespace|state|class)\b/,
			end: /^\s*end\s*$/,
		},
	},
};
