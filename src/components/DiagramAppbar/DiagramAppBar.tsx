"use client";

import {
	type SavedDiagram,
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
import { FolderOpen, Plus, Save, HelpCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import GitHubButton from "./GitHubButton";
import LoadDiagramDialog from "./LoadDiagramDialog";
import SaveDiagramDialog from "./SaveDiagramDialog";
import HowToUseDialog from "./HowToUseDialog";

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
	const [openHowToUse, setOpenHowToUse] = useState<boolean>(false);

	useEffect(() => {
		const diagrams = getAllDiagramsFromStorage();
		setSavedDiagrams(diagrams);

		// Check if user has seen the welcome modal
		const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
		if (!hasSeenWelcome) {
			setOpenHowToUse(true);
			localStorage.setItem("hasSeenWelcome", "true");
		}
	}, []);

	const refreshSavedDiagrams = () => {
		const diagrams = getAllDiagramsFromStorage();
		setSavedDiagrams(diagrams);
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
							<IconButton onClick={onNewDiagram} aria-label="New Diagram">
								<Plus />
							</IconButton>
						</Tooltip>

						<Tooltip title="Open Saved Diagram">
							<IconButton
								onClick={() => setOpenLoadDialog(true)}
								aria-label="Open Saved Diagram"
							>
								<FolderOpen />
							</IconButton>
						</Tooltip>

						<Tooltip
							title={savedDiagramId ? "Update Saved Diagram" : "Save Diagram"}
						>
							<IconButton
								onClick={handleSave}
								aria-label={
									savedDiagramId ? "Update Saved Diagram" : "Save Diagram"
								}
							>
								<Save />
							</IconButton>
						</Tooltip>

						<Tooltip title="How to Use">
							<IconButton
								onClick={() => setOpenHowToUse(true)}
								aria-label="How to Use"
							>
								<HelpCircle />
							</IconButton>
						</Tooltip>
					</Box>{" "}
					<GitHubButton />
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

			<HowToUseDialog
				open={openHowToUse}
				onClose={() => setOpenHowToUse(false)}
			/>
		</>
	);
}
