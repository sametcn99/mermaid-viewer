"use client";

import {
  SavedDiagram,
  deleteDiagram,
  getAllDiagramsFromStorage,
  saveDiagramToStorage,
} from "@/lib/storage.utils";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { FolderOpen, MoreVertical, Plus, Save, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { siGithub } from "simple-icons/icons";

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

          <Link
            href="https://sametcc.me/mermaid-viewer"
            target="_blank"
            rel="noopener noreferrer"
            passHref
          >
            <Tooltip title="View on GitHub">
              <IconButton component="span">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  height="24"
                  width="24"
                >
                  <title>{siGithub.title}</title>
                  <path d={siGithub.path} />
                </svg>
              </IconButton>
            </Tooltip>
          </Link>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setOpenLoadDialog(true);
              }}
            >
              Manage Saved Diagrams
            </MenuItem>
          </Menu>
        </Toolbar>
      </MuiAppBar>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save Diagram</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Diagram Name"
            fullWidth
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveSubmit}
            disabled={!diagramName.trim()}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openLoadDialog}
        onClose={() => setOpenLoadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Saved Diagrams</DialogTitle>
        <DialogContent>
          {savedDiagrams.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
              No saved diagrams yet
            </Typography>
          ) : (
            <List>
              {savedDiagrams.map((diagram) => (
                <ListItemButton
                  key={diagram.id}
                  onClick={() => {
                    onLoadDiagram(diagram);
                    setOpenLoadDialog(false);
                  }}
                  selected={diagram.id === savedDiagramId}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemText
                    primary={diagram.name}
                    secondary={formatTimestamp(diagram.timestamp)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeleteDiagram(diagram.id, e)}
                    >
                      <Trash />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onNewDiagram();
              setOpenLoadDialog(false);
            }}
            startIcon={<Plus />}
          >
            New Diagram
          </Button>
          <Button onClick={() => setOpenLoadDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
