import Editor from "@monaco-editor/react";
import EditorLoadingSpinner from "./EditorLoadingSpinner";

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
	return (
		<Editor
			height="100%"
			language="mermaid"
			theme={theme}
			value={value}
			onChange={onChange}
			loading={<EditorLoadingSpinner />}
			options={{
				minimap: { enabled: false },
				scrollBeyondLastLine: false,
				fontSize: 14,
				wordWrap: "on",
				automaticLayout: true,
				domReadOnly: false,
				readOnly: false,
				contextmenu: true,
				quickSuggestions: false,
			}}
		/>
	);
}
