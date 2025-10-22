import Editor, { type OnMount, useMonaco } from "@monaco-editor/react";
import { useRef, useCallback, useEffect } from "react";
import type * as monaco from "monaco-editor";
import { registerMermaidLanguage } from "@/lib/monaco";
import EditorLoadingSpinner from "./EditorLoadingSpinner";
import { useTheme } from "@mui/material";

interface MonacoEditorWrapperProps {
	value: string;
	onChange: (value: string | undefined) => void;
	theme: "vs-dark" | "light";
}

export default function MonacoEditorWrapper({
	value,
	onChange,
	theme,
}: MonacoEditorWrapperProps) {
	const muiTheme = useTheme();
	const monacoInstance = useMonaco();
	const cleanupRef = useRef<(() => void) | null>(null);
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	/**
	 * Called before Monaco Editor is mounted
	 * Registers Mermaid language with custom syntax highlighting,
	 * autocomplete, and validation
	 */
	const handleEditorWillMount = useCallback(
		(monaco: typeof import("monaco-editor")) => {
			// Clean up previous registration if it exists
			if (cleanupRef.current) {
				cleanupRef.current();
			}

			// Register Mermaid language with all features
			// This includes: tokenizer, language config, completions, validation, and custom theme
			cleanupRef.current = registerMermaidLanguage(monaco);

			// Define MUI-synced themes so editor background matches app background
			const bg = muiTheme.palette.background.default;
			const fg = muiTheme.palette.text.primary as string;
			monaco.editor.defineTheme("mui-dark", {
				base: "vs-dark",
				inherit: true,
				rules: [],
				colors: {
					"editor.background": bg,
					"editor.foreground": fg,
				},
			});
			monaco.editor.defineTheme("mui-light", {
				base: "vs",
				inherit: true,
				rules: [],
				colors: {
					"editor.background": bg,
					"editor.foreground": fg,
				},
			});
		},
		[muiTheme.palette.background.default, muiTheme.palette.text.primary],
	);

	/**
	 * Called after Monaco Editor is mounted
	 * Store editor instance for future operations
	 */
	const handleEditorDidMount: OnMount = useCallback(
		(
			editor: monaco.editor.IStandaloneCodeEditor,
			_monaco: typeof import("monaco-editor"),
		) => {
			// Store editor instance
			editorRef.current = editor;

			// Focus editor on mount for better UX
			editor.focus();
		},
		[],
	);

	// If MUI theme changes at runtime, re-define and apply the theme
	useEffect(() => {
		if (!monacoInstance) return;
		const bg = muiTheme.palette.background.default;
		const fg = muiTheme.palette.text.primary as string;
		monacoInstance.editor.defineTheme("mui-dark", {
			base: "vs-dark",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": bg,
				"editor.foreground": fg,
			},
		});
		monacoInstance.editor.defineTheme("mui-light", {
			base: "vs",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": bg,
				"editor.foreground": fg,
			},
		});
		monacoInstance.editor.setTheme(
			theme === "vs-dark" ? "mui-dark" : "mui-light",
		);
	}, [
		monacoInstance,
		muiTheme.palette.background.default,
		muiTheme.palette.text.primary,
		theme,
	]);

	/**
	 * Cleanup on component unmount
	 */
	useEffect(() => {
		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}
		};
	}, []);

	// Determine Monaco theme based on prop + MUI colors
	const computedTheme = theme === "vs-dark" ? "mui-dark" : "mui-light";
	return (
		<Editor
			height="100%"
			language="mermaid"
			theme={computedTheme}
			value={value}
			onChange={onChange}
			loading={<EditorLoadingSpinner />}
			beforeMount={handleEditorWillMount}
			onMount={handleEditorDidMount}
			options={{
				// Basic editor options
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				fontSize: 14,
				wordWrap: "off",
				automaticLayout: true,
				domReadOnly: false,
				readOnly: false,
				contextmenu: true,

				// Autocomplete and suggestions (powered by mermaid-completions.ts)
				quickSuggestions: {
					other: true,
					comments: false,
					strings: true,
				},
				suggestOnTriggerCharacters: true,
				acceptSuggestionOnCommitCharacter: true,
				acceptSuggestionOnEnter: "on",
				tabCompletion: "on",
				wordBasedSuggestions: "off",

				// Code editing features (powered by mermaid-language.ts)
				folding: true,
				foldingStrategy: "auto",
				showFoldingControls: "mouseover",
				matchBrackets: "always",
				autoClosingBrackets: "always",
				autoClosingQuotes: "always",
				formatOnPaste: true,
				formatOnType: true,

				// Scrollbar settings
				scrollbar: {
					vertical: "auto",
					horizontal: "auto",
					useShadows: false,
					verticalScrollbarSize: 10,
					horizontalScrollbarSize: 10,
				},

				// Line numbers and visual guides
				lineNumbers: "on",
				renderLineHighlight: "all",
				renderWhitespace: "selection",
				guides: {
					indentation: true,
					bracketPairs: true,
				},

				// Validation and diagnostics (powered by mermaid-validation.ts)
				// Markers are automatically displayed via setupMermaidValidation
			}}
		/>
	);
}
