"use client";

import DiagramAppBar from "@/components/DiagramAppbar/DiagramAppBar";
import AlertSnackbar from "@/components/Home/AlertSnackbar";
import LoadDiagramDialog from "@/components/Home/LoadDiagramDialog";
import ResizablePanels from "@/components/Home/ResizablePanels";
import useMermaidStore from "@/hooks/useMermaidStore";
import { getAllDiagramsFromStorage } from "@/lib/storage.utils";
import { Box } from "@mui/material";

export default function Home() {
  const {
    mermaidCode,
    debouncedCode,
    openLoadDialog,
    alertMessage,
    handleEditorChange,
    handleLoadDiagram,
    handleNewDiagram,
    handleCloseLoadDialog,
    handleAlertClose,
  } = useMermaidStore();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <DiagramAppBar />
      <ResizablePanels
        mermaidCode={mermaidCode}
        debouncedCode={debouncedCode}
        handleEditorChange={handleEditorChange}
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
