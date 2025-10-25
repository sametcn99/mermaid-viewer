import type { SavedDiagram } from "@/lib/utils/local-storage/diagrams.storage";
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
import type React from "react";

interface LoadDiagramDialogProps {
	open: boolean;
	onClose: () => void;
	onLoadDiagram: (diagram: SavedDiagram) => void;
	onNewDiagram: () => void;
	diagrams: SavedDiagram[];
}

const LoadDiagramDialog: React.FC<LoadDiagramDialogProps> = ({
	open,
	onClose,
	onLoadDiagram,
	onNewDiagram,
	diagrams,
}) => (
	<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
		<DialogTitle>Mermaid Editor</DialogTitle>
		<DialogContent>
			<Typography>
				You have previously saved diagrams. Would you like to load one or create
				a new diagram?
			</Typography>
			<List>
				{diagrams.map((diagram) => (
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

export default LoadDiagramDialog;
