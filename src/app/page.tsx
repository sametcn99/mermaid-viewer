"use client";

import DiagramAppBar from "@/components/DiagramAppbar/DiagramAppBar";
import AlertSnackbar from "@/components/Home/AlertSnackbar";
import LoadDiagramDialog from "@/components/Home/LoadDiagramDialog";
import ResizablePanels from "@/components/Home/ResizablePanels";
import useMermaidStore from "@/hooks/useMermaidStore";
import { Box } from "@mui/material";

export default function Home() {
  const {
    alertMessage,
    handleAlertClose,
  } = useMermaidStore();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <DiagramAppBar />
      <ResizablePanels />
      <LoadDiagramDialog />
      <AlertSnackbar
        open={!!alertMessage}
        message={alertMessage || ""}
        onClose={handleAlertClose}
      />
    </Box>
  );
}
