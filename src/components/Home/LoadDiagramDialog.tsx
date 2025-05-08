import { SavedDiagram } from "@/lib/storage.utils";
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

interface LoadDiagramDialogProps {
  open: boolean;
  onClose: () => void;
  diagrams: SavedDiagram[];
  onLoadDiagram: (diagram: SavedDiagram) => void;
  onNewDiagram: () => void;
}

export default function LoadDiagramDialog({
  open,
  onClose,
  diagrams,
  onLoadDiagram,
  onNewDiagram,
}: LoadDiagramDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
              onClick={() => onLoadDiagram(diagram)}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onNewDiagram}>
          Create New Diagram
        </Button>
      </DialogActions>
    </Dialog>
  );
}
