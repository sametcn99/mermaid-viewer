"use client";

import DiagramAppBar from "@/components/DiagramAppBar";
import DiagramPanel from "@/components/DiagramPanel";
import EditorPanel from "@/components/EditorPanel";
import {
  findMatchingDiagramId,
  getAllDiagramsFromStorage,
  SavedDiagram,
  updateDiagram,
} from "@/lib/storageUtils";
import {
  getMermaidCodeFromUrl,
  updateUrlWithMermaidCode,
} from "@/lib/urlUtils";
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
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import Split from "react-split";

const initialMermaidCode = `graph TD
  A[Start] --> B{Is it Friday?};
  B -- Yes --> C[Party!];
  B -- No --> D[Code];
  D --> E[Coffee];
  E --> D;
  C --> F[Sleep];
`;

export default function Home() {
  // Initialize with URL mermaid code or fallback to default
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [debouncedCode, setDebouncedCode] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [currentDiagramId, setCurrentDiagramId] = useState<string | undefined>(
    undefined,
  );
  const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check for small screens (e.g., < 600px)

  // Load initial diagram from URL or local storage or use default
  useEffect(() => {
    const codeFromUrl = getMermaidCodeFromUrl();

    // If URL has code, use it
    if (codeFromUrl) {
      setMermaidCode(codeFromUrl);
      setDebouncedCode(codeFromUrl);

      // Check if this URL code matches any saved diagram
      const matchedId = findMatchingDiagramId(codeFromUrl);
      if (matchedId) {
        setCurrentDiagramId(matchedId);
        setHasUnsavedChanges(false);
      }

      return;
    }

    // Check if there are any saved diagrams
    const savedDiagrams = getAllDiagramsFromStorage();
    if (savedDiagrams.length > 0) {
      // Show load dialog if there are saved diagrams
      setOpenLoadDialog(true);
    } else {
      // Use default code if no saved diagrams and no URL parameter
      setMermaidCode(initialMermaidCode);
      setDebouncedCode(initialMermaidCode);
      updateUrlWithMermaidCode(initialMermaidCode);
    }
  }, []);

  // Debounce the update to the diagram panel
  // Use useMemo to ensure the debounced function is stable
  const debouncedSetDiagramCode = useMemo(
    () =>
      debounce((code: string) => {
        setDebouncedCode(code);
      }, 300),
    [], // Empty dependency array means this is created once
  );

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setMermaidCode(newCode);
    debouncedSetDiagramCode(newCode);

    // Mark as having unsaved changes if content changed
    if (currentDiagramId) {
      const savedDiagrams = getAllDiagramsFromStorage();
      const currentSaved = savedDiagrams.find((d) => d.id === currentDiagramId);
      if (currentSaved && currentSaved.code !== newCode) {
        setHasUnsavedChanges(true);
      } else {
        setHasUnsavedChanges(false);
      }
    } else if (newCode !== initialMermaidCode) {
      setHasUnsavedChanges(true);
    }
  };

  // Handle loading a diagram
  const handleLoadDiagram = (diagram: SavedDiagram) => {
    setMermaidCode(diagram.code);
    setDebouncedCode(diagram.code);
    setCurrentDiagramId(diagram.id);
    updateUrlWithMermaidCode(diagram.code);
    setHasUnsavedChanges(false);
    setAlertMessage(`Loaded diagram: ${diagram.name}`);
  };

  // Handle creating a new diagram
  const handleNewDiagram = () => {
    setMermaidCode(initialMermaidCode);
    setDebouncedCode(initialMermaidCode);
    setCurrentDiagramId(undefined);
    updateUrlWithMermaidCode(initialMermaidCode);
    setHasUnsavedChanges(false);
    setAlertMessage("Created new diagram");
  };

  // Handle saving a diagram
  const handleSaveDiagram = (diagramId: string | undefined) => {
    if (diagramId) {
      // Update existing
      const updated = updateDiagram(diagramId, { code: mermaidCode });
      if (updated) {
        setHasUnsavedChanges(false);
        setAlertMessage("Diagram updated");
      }
    } else {
      // Will be handled by DiagramAppBar component through dialog
    }
  };

  // Save before closing handler
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetDiagramCode.cancel();
    };
  }, [debouncedSetDiagramCode]);

  // Handle load dialog open/close
  const handleCloseLoadDialog = () => {
    setOpenLoadDialog(false);
    // If no diagram loaded, use the default
    if (!currentDiagramId && mermaidCode === "") {
      setMermaidCode(initialMermaidCode);
      setDebouncedCode(initialMermaidCode);
      updateUrlWithMermaidCode(initialMermaidCode);
    }
  };

  // Handle snackbar
  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* DiagramAppBar */}
      <DiagramAppBar
        currentDiagram={mermaidCode}
        savedDiagramId={currentDiagramId}
        onLoadDiagram={handleLoadDiagram}
        onNewDiagram={handleNewDiagram}
        onSaveDiagram={handleSaveDiagram}
      />
      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Split
          sizes={[50, 50]}
          minSize={isSmallScreen ? 0 : 100} // Allow collapsing on small screens
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction={isSmallScreen ? "vertical" : "horizontal"} // Stack vertically on small screens
          cursor={isSmallScreen ? "row-resize" : "col-resize"}
          style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            height: "100%",
            width: "100%",
          }} // Ensure Split takes full height/width
        >
          {/* Editor Panel */}
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <EditorPanel
              initialValue={mermaidCode}
              onChange={handleEditorChange}
              theme={isDarkMode ? "vs-dark" : "light"}
            />
          </Box>

          {/* Diagram Panel */}
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <DiagramPanel mermaidCode={debouncedCode} />
          </Box>
        </Split>
      </Box>

      {/* Initial Load Dialog */}
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
            {getAllDiagramsFromStorage().map((diagram) => (
              <ListItem
                key={diagram.id}
                onClick={() => {
                  handleLoadDiagram(diagram);
                  setOpenLoadDialog(false);
                }}
                sx={{ borderRadius: 1, mb: 1, cursor: "pointer" }}
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
              setOpenLoadDialog(false);
            }}
          >
            Create New Diagram
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
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
