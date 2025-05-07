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
  ListItemSecondaryAction, // Added ListItemButton
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

const DiagramAppBar: React.FC<DiagramAppBarProps> = ({
  currentDiagram,
  savedDiagramId,
  onLoadDiagram,
  onNewDiagram,
  onSaveDiagram,
}) => {
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
  const [diagramName, setDiagramName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Load saved diagrams from localStorage
  useEffect(() => {
    const diagrams = getAllDiagramsFromStorage();
    setSavedDiagrams(diagrams);
  }, []);

  // Refresh saved diagrams list whenever a diagram is saved/deleted
  const refreshSavedDiagrams = () => {
    const diagrams = getAllDiagramsFromStorage();
    setSavedDiagrams(diagrams);
  };

  // Handle opening the menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle saving a new diagram
  const handleSave = () => {
    if (savedDiagramId) {
      // Already saved, just update
      onSaveDiagram(savedDiagramId);
      return;
    }

    // New save - open dialog
    setOpenDialog(true);
    setDiagramName(`Untitled Diagram ${savedDiagrams.length + 1}`);
  };

  // Handle submitting the save dialog
  const handleSaveSubmit = () => {
    const diagram = saveDiagramToStorage(diagramName, currentDiagram);
    refreshSavedDiagrams();
    setOpenDialog(false);
    onSaveDiagram(diagram.id);
  };

  // Handle deleting a diagram
  const handleDeleteDiagram = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteDiagram(id);
    refreshSavedDiagrams();
  };

  // Format timestamp for display
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
                <MoreVertical /> {/* Changed MoreVert to MoreVertical */}
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

      {/* Save Dialog */}
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

      {/* Load Dialog */}
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
                <ListItemButton // Changed ListItem to ListItemButton
                  key={diagram.id}
                  // button prop removed as ListItemButton implies this behavior
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
                </ListItemButton> // Changed ListItem to ListItemButton
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
};

export default DiagramAppBar;
