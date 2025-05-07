"use client";

import {
  SavedDiagram,
  deleteDiagram,
  getAllDiagramsFromStorage,
  saveDiagramToStorage,
} from "@/lib/storage.utils";
import {
  Box,
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { FolderOpen, MoreVertical, Plus, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import AppBarMenu from "./AppBarMenu";
import GitHubButton from "./GitHubButton";
import LoadDiagramDialog from "./LoadDiagramDialog";
import SaveDiagramDialog from "./SaveDiagramDialog";

interface DiagramAppBarProps {
  currentDiagram: string;
  savedDiagramId?: string;
  onLoadDiagram: (diagram: SavedDiagram) => void;
  onNewDiagram: () => void;
  onSaveDiagram: (diagramId: string | undefined) => void;
}

export default function DiagramAppBar({
  currentDiagram,
  savedDiagramId,
  onLoadDiagram,
  onNewDiagram,
  onSaveDiagram,
}: DiagramAppBarProps) {
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
  const [diagramName, setDiagramName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const diagrams = getAllDiagramsFromStorage();
    setSavedDiagrams(diagrams);
  }, []);

  const refreshSavedDiagrams = () => {
    const diagrams = getAllDiagramsFromStorage();
    setSavedDiagrams(diagrams);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    if (savedDiagramId) {
      onSaveDiagram(savedDiagramId);
      return;
    }

    setOpenDialog(true);
    setDiagramName(`Untitled Diagram ${savedDiagrams.length + 1}`);
  };

  const handleSaveSubmit = () => {
    const diagram = saveDiagramToStorage(diagramName, currentDiagram);
    refreshSavedDiagrams();
    setOpenDialog(false);
    onSaveDiagram(diagram.id);
  };

  const handleDeleteDiagram = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteDiagram(id);
    refreshSavedDiagrams();
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <MuiAppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mermaid Viewer
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="New Diagram">
              <IconButton onClick={onNewDiagram}>
                <Plus />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open Saved Diagram">
              <IconButton onClick={() => setOpenLoadDialog(true)}>
                <FolderOpen />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={savedDiagramId ? "Update Saved Diagram" : "Save Diagram"}
            >
              <IconButton onClick={handleSave}>
                <Save />
              </IconButton>
            </Tooltip>

            <Tooltip title="More Options">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertical />
              </IconButton>
            </Tooltip>
          </Box>

          <GitHubButton />

          <AppBarMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onManageSavedDiagrams={() => setOpenLoadDialog(true)}
          />
        </Toolbar>
      </MuiAppBar>

      <SaveDiagramDialog
        open={openDialog}
        diagramName={diagramName}
        setDiagramName={setDiagramName}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveSubmit}
      />

      <LoadDiagramDialog
        open={openLoadDialog}
        savedDiagrams={savedDiagrams}
        savedDiagramId={savedDiagramId}
        onLoadDiagram={(diagram) => {
          onLoadDiagram(diagram);
          setOpenLoadDialog(false);
        }}
        onNewDiagram={() => {
          onNewDiagram();
          setOpenLoadDialog(false);
        }}
        onDeleteDiagram={handleDeleteDiagram}
        onClose={() => setOpenLoadDialog(false)}
        formatTimestamp={formatTimestamp}
      />
    </>
  );
}
