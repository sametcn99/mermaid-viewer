import useMermaidStore from "@/hooks/useMermaidStore";
import { getAllDiagramsFromStorage, SavedDiagram } from "@/lib/storage.utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

export default function LoadDiagramDialog() {
  const {
    openLoadDialog,
    handleLoadDiagram,
    handleNewDiagram,
    handleCloseLoadDialog,
  } = useMermaidStore();
  const diagrams = getAllDiagramsFromStorage();
  return (
    <Dialog
      open={openLoadDialog}
      onClose={handleCloseLoadDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Load Diagram</DialogTitle>
      <DialogContent>
        <Typography>
          You have previously saved diagrams. Would you like to load one or
          create a new diagram?
        </Typography>
        <List>
          {diagrams.map((diagram: SavedDiagram) => (
            <ListItem
              key={diagram.id}
              onClick={() => handleLoadDiagram(diagram)}
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
        <Button variant="contained" onClick={handleNewDiagram}>
          Create New Diagram
        </Button>
      </DialogActions>
    </Dialog>
  );
}
