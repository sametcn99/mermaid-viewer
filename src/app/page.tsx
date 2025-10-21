"use client";

import DiagramAppBar from "@/components/DiagramAppbar/DiagramAppBar";
import AlertSnackbar from "@/components/Home/AlertSnackbar";
import LoadDiagramDialog from "@/components/Home/LoadDiagramDialog";
import ResizablePanels from "@/components/Home/ResizablePanels";
import { useMermaid } from "@/hooks/useMermaid";
import { useResizablePanels } from "@/hooks/useResizablePanels";
import { getAllDiagramsFromStorage } from "@/lib/storage.utils";
import { Box, useMediaQuery, useTheme } from "@mui/material";

export default function Home() {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const {
		panelSize: editorPanelSize,
		containerRef,
		handleMouseDown,
	} = useResizablePanels({
		initialSize: 50,
		minSize: isSmallScreen ? 0 : 10,
		maxSize: isSmallScreen ? 100 : 90,
		isVertical: isSmallScreen,
	});
	const {
		mermaidCode,
		debouncedCode,
		currentDiagramId,
		openLoadDialog,
		alertMessage,
		handleEditorChange,
		handleLoadDiagram,
		handleNewDiagram,
		handleSaveDiagram,
		handleCloseLoadDialog,
		handleAlertClose,
	} = useMermaid();

	return (
		<Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			<DiagramAppBar
				currentDiagram={mermaidCode}
				savedDiagramId={currentDiagramId}
				onLoadDiagram={handleLoadDiagram}
				onNewDiagram={handleNewDiagram}
				onSaveDiagram={handleSaveDiagram}
			/>
			<ResizablePanels
				editorPanelSize={editorPanelSize}
				containerRef={containerRef}
				handleMouseDown={handleMouseDown}
				isSmallScreen={isSmallScreen}
				mermaidCode={mermaidCode}
				debouncedCode={debouncedCode}
				handleEditorChange={handleEditorChange}
				isDarkMode={isDarkMode}
			/>
			<LoadDiagramDialog
				open={openLoadDialog}
				onClose={handleCloseLoadDialog}
				onLoadDiagram={handleLoadDiagram}
				onNewDiagram={handleNewDiagram}
				diagrams={getAllDiagramsFromStorage()}
			/>
			<AlertSnackbar
				open={!!alertMessage}
				message={alertMessage || ""}
				onClose={handleAlertClose}
			/>
		</Box>
	);
}
