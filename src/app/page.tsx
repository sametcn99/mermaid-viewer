"use client";

import DiagramAppBar from "@/components/DiagramAppBar";
import DiagramPanel from "@/components/DiagramPanel";
import EditorPanel from "@/components/EditorPanel";
import { useMermaid } from "@/hooks/useMermaid";
import { useResizablePanels } from "@/hooks/useResizablePanels";
import { SavedDiagram, getAllDiagramsFromStorage } from "@/lib/storage.utils";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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
      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
          flexDirection: isSmallScreen ? "column" : "row",
          height: "calc(100vh - 64px)",
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: isSmallScreen ? `${editorPanelSize}%` : "100%",
            width: isSmallScreen ? "100%" : `${editorPanelSize}%`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <EditorPanel
            initialValue={mermaidCode}
            onChange={handleEditorChange}
            theme={isDarkMode ? "vs-dark" : "light"}
          />
        </Box>

        <Box
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          sx={{
            width: isSmallScreen ? "100%" : "10px",
            height: isSmallScreen ? "10px" : "100%",
            cursor: isSmallScreen ? "row-resize" : "col-resize",
            backgroundColor: theme.palette.divider,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box
            sx={{
              width: isSmallScreen ? "30px" : "2px",
              height: isSmallScreen ? "2px" : "30px",
              backgroundColor: theme.palette.text.disabled,
              borderRadius: "1px",
            }}
          />
        </Box>

        <Box
          sx={{
            height: isSmallScreen ? `${100 - editorPanelSize}%` : "100%",
            width: isSmallScreen ? "100%" : `${100 - editorPanelSize}%`,
            overflow: "hidden",
          }}
        >
          <DiagramPanel mermaidCode={debouncedCode} />
        </Box>
      </Box>

      <Dialog
        open={openLoadDialog}
        onClose={handleCloseLoadDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mermaid Viewer</DialogTitle>
        <DialogContent>
          <Typography>
            You have previously saved diagrams. Would you like to load one or
            create a new diagram?
          </Typography>
          <List>
            {getAllDiagramsFromStorage().map((diagram: SavedDiagram) => (
              <ListItem
                key={diagram.id}
                onClick={() => {
                  handleLoadDiagram(diagram);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary={diagram.name}
                  secondary={new Date(diagram.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoadDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleNewDiagram();
            }}
          >
            Create New Diagram
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity="success">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
