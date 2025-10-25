import type { SavedDiagram } from "@/lib/utils/local-storage/diagrams.storage";
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
	Snackbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { Plus, Share2, Trash } from "lucide-react";
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
	const [showCopyNotification, setShowCopyNotification] = useState(false);

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

	const handleShareDiagram = async (
		diagramId: string,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();

		if (typeof window === "undefined") return;

		// Create URL with the diagram ID
		const baseUrl = window.location.origin + window.location.pathname;
		const diagramUrl = `${baseUrl}?id=${diagramId}`;

		// Check if Web Share API is supported
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Mermaid Diagram",
					text: "Check out this Mermaid diagram",
					url: diagramUrl,
				});
			} catch (err) {
				// User cancelled the share or an error occurred
				if (err instanceof Error && err.name !== "AbortError") {
					// Fallback to copy if share fails (but not if user cancelled)
					fallbackToCopy(diagramUrl);
				}
			}
		} else {
			// Fallback to copying URL if Web Share API is not supported
			fallbackToCopy(diagramUrl);
		}
	};

	const fallbackToCopy = (url: string) => {
		navigator.clipboard
			.writeText(url)
			.then(() => {
				setShowCopyNotification(true);
			})
			.catch((err) => {
				console.error("Failed to copy URL:", err);
			});
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
										<Tooltip title="Share diagram" arrow>
											<IconButton
												onClick={(e) => handleShareDiagram(diagram.id, e)}
												aria-label="Share diagram"
											>
												<Share2 />
											</IconButton>
										</Tooltip>
										<Tooltip title="Delete diagram" arrow>
											<IconButton
												edge="end"
												onClick={(e) =>
													handleDeleteClick(diagram.id, diagram.name, e)
												}
												aria-label="Delete diagram"
											>
												<Trash />
											</IconButton>
										</Tooltip>
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

			<Snackbar
				open={showCopyNotification}
				autoHideDuration={3000}
				onClose={() => setShowCopyNotification(false)}
				message="URL copied to clipboard!"
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			/>

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
