import type { SavedDiagram } from "@/lib/storage.utils";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	List,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	Typography,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface LoadDiagramDialogProps {
	open: boolean;
	savedDiagrams: SavedDiagram[];
	savedDiagramId?: string;
	onLoadDiagram: (diagram: SavedDiagram) => void;
	onNewDiagram: () => void;
	onDeleteDiagram: (id: string, event: React.MouseEvent) => void;
	onClose: () => void;
	formatTimestamp: (timestamp: number) => string;
}

const LoadDiagramDialog: React.FC<LoadDiagramDialogProps> = ({
	open,
	savedDiagrams,
	savedDiagramId,
	onLoadDiagram,
	onNewDiagram,
	onDeleteDiagram,
	onClose,
	formatTimestamp,
}) => {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [diagramToDelete, setDiagramToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const handleDeleteClick = (
		id: string,
		name: string,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();
		setDiagramToDelete({ id, name });
		setDeleteConfirmOpen(true);
	};

	const handleConfirmDelete = (event: React.MouseEvent) => {
		if (diagramToDelete) {
			onDeleteDiagram(diagramToDelete.id, event);
			setDeleteConfirmOpen(false);
			setDiagramToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setDeleteConfirmOpen(false);
		setDiagramToDelete(null);
	};

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
										onClose();
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
											onClick={(e) =>
												handleDeleteClick(diagram.id, diagram.name, e)
											}
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
							onClose();
						}}
						startIcon={<Plus />}
					>
						New Diagram
					</Button>
					<Button onClick={onClose}>Close</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={deleteConfirmOpen}
				onClose={handleCancelDelete}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Delete Diagram</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete "{diagramToDelete?.name}"? This
						action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete}>Cancel</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default LoadDiagramDialog;
