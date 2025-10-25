"use client";

import { updateBrowserUrlWithDiagramCode } from "@/lib/utils/url.utils";
import EditorPanelLayout from "./EditorPanelLayout";

interface EditorPanelProps {
	initialValue: string;
	onChange: (value: string | undefined) => void;
	theme?: "vs-dark" | "light";
}

export default function EditorPanel({
	initialValue,
	onChange,
	theme = "light",
}: EditorPanelProps) {
	// Debounced handler for editor changes
	const handleEditorChange = (value: string | undefined) => {
		onChange(value);
		if (value !== undefined) {
			const timeoutId = setTimeout(() => {
				updateBrowserUrlWithDiagramCode(value);
			}, 1000);
			return () => clearTimeout(timeoutId);
		}
	};

	return (
		<EditorPanelLayout
			value={initialValue}
			onChange={handleEditorChange}
			theme={theme}
		/>
	);
}
