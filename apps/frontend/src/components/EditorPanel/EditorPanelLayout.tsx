import { Box } from "@mui/material";
import MonacoEditorWrapper from "./MonacoEditorWrapper";

interface EditorPanelLayoutProps {
	value: string;
	onChange: (value: string | undefined) => void;
	theme: "vs-dark" | "light";
}

export default function EditorPanelLayout({
	value,
	onChange,
	theme,
}: EditorPanelLayoutProps) {
	return (
		<Box sx={{ height: "100%", width: "100%", bgcolor: "background.default" }}>
			<MonacoEditorWrapper value={value} onChange={onChange} theme={theme} />
		</Box>
	);
}
