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
	useMediaQuery,
	useTheme,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Chip,
	Divider,
	Badge,
} from "@mui/material";
import {
	FolderOpen,
	Plus,
	Save,
	HelpCircle,
	FileText,
	MenuIcon,
	Check,
} from "lucide-react";
import type React from "react";
import { useEffect, useState, useId } from "react";
import GitHubButton from "./DiagramAppbar/GitHubButton";
import SaveDiagramDialog from "./DiagramAppbar/SaveDiagramDialog";
import LoadDiagramDialog from "./DiagramAppbar/LoadDiagramDialog";
import HowToUseDialog from "./DiagramAppbar/HowToUseDialog";
import TemplateDialog from "./DiagramAppbar/TemplateDialog";

interface AppBarProps {
	currentDiagram: string;
	savedDiagramId?: string;
	onLoadDiagram: (diagram: SavedDiagram) => void;
	onNewDiagram: () => void;
	onSaveDiagram: (diagramId: string | undefined) => void;
	onSelectTemplate?: (code: string, name: string) => void;
}

export default function AppBar({
	currentDiagram,
	savedDiagramId,
	onLoadDiagram,
	onNewDiagram,
	onSaveDiagram,
	onSelectTemplate,
}: AppBarProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));

	const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
	const [diagramName, setDiagramName] = useState<string>("");
	const [openHowToUse, setOpenHowToUse] = useState<boolean>(false);
	const [openTemplateDialog, setOpenTemplateDialog] = useState<boolean>(false);
	const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
		null,
	);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	const mobileMenuId = useId();

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

	useEffect(() => {
		if (savedDiagramId) {
			const savedDiagram = savedDiagrams.find((d) => d.id === savedDiagramId);
			if (savedDiagram && savedDiagram.code !== currentDiagram) {
				setHasUnsavedChanges(true);
			} else {
				setHasUnsavedChanges(false);
			}
		} else {
			setHasUnsavedChanges(currentDiagram.trim().length > 0);
		}
	}, [currentDiagram, savedDiagramId, savedDiagrams]);

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

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMenuAnchor(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMenuAnchor(null);
	};

	const handleNewDiagram = () => {
		onNewDiagram();
		handleMobileMenuClose();
	};

	const handleOpenTemplates = () => {
		setOpenTemplateDialog(true);
		handleMobileMenuClose();
	};

	const handleOpenLoad = () => {
		setOpenLoadDialog(true);
		handleMobileMenuClose();
	};

	const handleOpenSave = () => {
		handleSave();
		handleMobileMenuClose();
	};

	const handleOpenHelp = () => {
		setOpenHowToUse(true);
		handleMobileMenuClose();
	};

	const currentDiagramName = savedDiagramId
		? savedDiagrams.find((d) => d.id === savedDiagramId)?.name
		: null;

	return (
		<>
			<MuiAppBar position="static" color="default" elevation={2}>
				<Toolbar variant="dense" sx={{ gap: { xs: 1, sm: 2 } }}>
					<Box sx={{ flexGrow: 1, minWidth: 0 }}>
						<Typography
							variant="h6"
							sx={{
								userSelect: "none",
								fontWeight: 700,
								fontSize: { xs: "1.1rem", sm: "1.5rem" },
								color: "#ffffff",
								letterSpacing: "-0.02em",
								fontFamily:
									'"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
								display: "flex",
								alignItems: "center",
								gap: 1,
								flexWrap: "wrap",
							}}
						>
							<span>Mermaid Editor</span>
							{currentDiagramName && !isMobile && (
								<Chip
									label={currentDiagramName}
									size="small"
									color={hasUnsavedChanges ? "warning" : "success"}
									icon={hasUnsavedChanges ? undefined : <Check size={14} />}
									sx={{ maxWidth: 200 }}
								/>
							)}
						</Typography>
						{currentDiagramName && isMobile && (
							<Typography
								variant="caption"
								sx={{
									color: "rgba(255, 255, 255, 0.7)",
									display: "block",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{currentDiagramName}
								{hasUnsavedChanges && " (unsaved)"}
							</Typography>
						)}
					</Box>

					{!isTablet && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<Tooltip title="New Diagram (Ctrl+N)">
								<IconButton
									onClick={onNewDiagram}
									aria-label="New Diagram"
									size="medium"
								>
									<Plus size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title="Browse Templates (Ctrl+T)">
								<IconButton
									onClick={() => setOpenTemplateDialog(true)}
									aria-label="Browse Templates"
									size="medium"
								>
									<FileText size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title="Open Saved Diagram (Ctrl+O)">
								<IconButton
									onClick={() => setOpenLoadDialog(true)}
									aria-label="Open Saved Diagram"
									size="medium"
								>
									<Badge badgeContent={savedDiagrams.length} color="primary">
										<FolderOpen size={20} />
									</Badge>
								</IconButton>
							</Tooltip>

							<Tooltip
								title={
									savedDiagramId
										? hasUnsavedChanges
											? "Update Saved Diagram (Ctrl+S)"
											: "Diagram Saved"
										: "Save Diagram (Ctrl+S)"
								}
							>
								<IconButton
									onClick={handleSave}
									aria-label={
										savedDiagramId ? "Update Saved Diagram" : "Save Diagram"
									}
									size="medium"
									color={hasUnsavedChanges ? "warning" : "default"}
								>
									<Save size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title="How to Use (F1)">
								<IconButton
									onClick={() => setOpenHowToUse(true)}
									aria-label="How to Use"
									size="medium"
								>
									<HelpCircle size={20} />
								</IconButton>
							</Tooltip>

							<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

							<GitHubButton />
						</Box>
					)}

					{isTablet && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							{!isMobile && (
								<>
									<Tooltip title="Save (Ctrl+S)">
										<IconButton
											onClick={handleSave}
											aria-label="Save Diagram"
											size="medium"
											color={hasUnsavedChanges ? "warning" : "default"}
										>
											<Save size={20} />
										</IconButton>
									</Tooltip>

									<Tooltip title="Open (Ctrl+O)">
										<IconButton
											onClick={() => setOpenLoadDialog(true)}
											aria-label="Open Saved Diagram"
											size="medium"
										>
											<Badge
												badgeContent={savedDiagrams.length}
												color="primary"
											>
												<FolderOpen size={20} />
											</Badge>
										</IconButton>
									</Tooltip>
								</>
							)}

							<Tooltip title="More actions">
								<IconButton
									onClick={handleMobileMenuOpen}
									aria-label="More actions"
									aria-controls={mobileMenuId}
									aria-haspopup="true"
									size="medium"
								>
									<MenuIcon size={20} />
								</IconButton>
							</Tooltip>
						</Box>
					)}
				</Toolbar>
			</MuiAppBar>

			<Menu
				id={mobileMenuId}
				anchorEl={mobileMenuAnchor}
				open={Boolean(mobileMenuAnchor)}
				onClose={handleMobileMenuClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuItem onClick={handleNewDiagram}>
					<ListItemIcon>
						<Plus size={20} />
					</ListItemIcon>
					<ListItemText primary="New Diagram" secondary="Ctrl+N" />
				</MenuItem>

				<MenuItem onClick={handleOpenTemplates}>
					<ListItemIcon>
						<FileText size={20} />
					</ListItemIcon>
					<ListItemText primary="Browse Templates" secondary="Ctrl+T" />
				</MenuItem>

				{isMobile && (
					<MenuItem onClick={handleOpenLoad}>
						<ListItemIcon>
							<Badge badgeContent={savedDiagrams.length} color="primary">
								<FolderOpen size={20} />
							</Badge>
						</ListItemIcon>
						<ListItemText
							primary="Open Saved"
							secondary={`${savedDiagrams.length} saved`}
						/>
					</MenuItem>
				)}

				{isMobile && (
					<MenuItem onClick={handleOpenSave}>
						<ListItemIcon>
							<Save size={20} />
						</ListItemIcon>
						<ListItemText
							primary={savedDiagramId ? "Update" : "Save"}
							secondary={hasUnsavedChanges ? "Unsaved changes" : "Ctrl+S"}
						/>
					</MenuItem>
				)}

				<Divider />

				<MenuItem onClick={handleOpenHelp}>
					<ListItemIcon>
						<HelpCircle size={20} />
					</ListItemIcon>
					<ListItemText primary="How to Use" secondary="F1" />
				</MenuItem>

				<MenuItem
					component="a"
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleMobileMenuClose}
				>
					<ListItemIcon>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<title>GitHub</title>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
					</ListItemIcon>
					<ListItemText primary="View on GitHub" />
				</MenuItem>
			</Menu>

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

			<TemplateDialog
				open={openTemplateDialog}
				onClose={() => setOpenTemplateDialog(false)}
				onSelectTemplate={(code, name) => {
					if (onSelectTemplate) {
						onSelectTemplate(code, name);
					}
				}}
				currentDiagramCode={currentDiagram}
				currentDiagramName={currentDiagramName}
			/>
		</>
	);
}
