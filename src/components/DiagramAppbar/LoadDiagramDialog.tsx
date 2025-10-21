import type { SavedDiagram } from "@/lib/storage.utils";
import {
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
	Typography,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import type React from "react";

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
}) => (
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
									onClick={(e) => onDeleteDiagram(diagram.id, e)}
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
);

export default LoadDiagramDialog;
