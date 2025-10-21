import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import type React from "react";

interface SaveDiagramDialogProps {
	open: boolean;
	diagramName: string;
	setDiagramName: (name: string) => void;
	onClose: () => void;
	onSave: () => void;
}

const SaveDiagramDialog: React.FC<SaveDiagramDialogProps> = ({
	open,
	diagramName,
	setDiagramName,
	onClose,
	onSave,
}) => (
	<Dialog open={open} onClose={onClose}>
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
			<Button onClick={onClose}>Cancel</Button>
			<Button
				onClick={onSave}
				disabled={!diagramName.trim()}
				variant="contained"
			>
				Save
			</Button>
		</DialogActions>
	</Dialog>
);

export default SaveDiagramDialog;
