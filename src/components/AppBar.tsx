"use client";

import { saveDiagramToStorage } from "@/lib/indexed-db/diagrams.storage";
import { getRawItem, setRawItem } from "@/lib/indexed-db";
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
import { useEffect, useMemo, useState, useId, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import GitHubButton from "./GitHubButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Monitor } from "lucide-react";
import SaveDiagramDialog from "./SaveDiagramDialog";
import HowToUseDialog from "./HowToUseDialog";
import TemplateDialog from "./TemplateDialog";
import {
	createNewDiagram,
	saveDiagramChanges,
	selectTemplateDiagram,
	setCustomAlertMessage,
	setCustomCurrentDiagramId,
	setCustomUnsavedChanges,
	setLoadDialogOpen,
} from "@/store/mermaidSlice";
import { compressToBase64 } from "@/lib/utils/compression.utils";
import {
	refreshSavedDiagrams,
	selectSavedDiagrams,
} from "@/store/savedDiagramsSlice";
import LoadDiagramDialog from "./LoadDiagramDialog";
import { useAppShortcuts } from "@/hooks/useAppShortcuts";

export default function AppBar() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { mermaidCode, currentDiagramId, hasUnsavedChanges } = useAppSelector(
		(state) => state.mermaid,
	);
	const savedDiagrams = useAppSelector(selectSavedDiagrams);

	const [openDialog, setOpenDialog] = useState(false);
	const [diagramName, setDiagramName] = useState("");
	const [openHowToUse, setOpenHowToUse] = useState(false);
	const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
	const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
		null,
	);
	const mobileMenuId = useId();

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			if (typeof window !== "undefined") {
				void dispatch(refreshSavedDiagrams());
			}

			const hasSeenWelcome = await getRawItem("mermaid-viewer-hasSeenWelcome");
			if (!hasSeenWelcome && isMounted) {
				setOpenHowToUse(true);
				await setRawItem("mermaid-viewer-hasSeenWelcome", "true");
			}
		};
		loadData();
		return () => {
			isMounted = false;
		};
	}, [dispatch]);

	// Listen for requests from other components (e.g. DiagramEmpty) to open
	// the TemplateDialog via a custom event 'openTemplateDialog'.
	useEffect(() => {
		const handler = () => setIsTemplateDialogOpen(true);
		window.addEventListener("openTemplateDialog", handler as EventListener);
		return () => {
			window.removeEventListener(
				"openTemplateDialog",
				handler as EventListener,
			);
		};
	}, []);

	const refreshDiagrams = useCallback(() => {
		void dispatch(refreshSavedDiagrams());
	}, [dispatch]);

	const handleSave = useCallback(() => {
		if (currentDiagramId) {
			dispatch(saveDiagramChanges(currentDiagramId));
			return;
		}

		setOpenDialog(true);
		setDiagramName(`Untitled Diagram ${savedDiagrams.length + 1}`);
	}, [currentDiagramId, dispatch, savedDiagrams.length]);

	const handleSaveSubmit = useCallback(async () => {
		const diagram = await saveDiagramToStorage(diagramName, mermaidCode);
		refreshDiagrams();
		setOpenDialog(false);
		dispatch(setCustomCurrentDiagramId(diagram.id));
		dispatch(setCustomUnsavedChanges(false));
		dispatch(setCustomAlertMessage("Diagram saved"));
	}, [diagramName, mermaidCode, dispatch, refreshDiagrams]);

	const handleMobileMenuOpen = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			setMobileMenuAnchor(event.currentTarget);
		},
		[],
	);

	const handleMobileMenuClose = useCallback(() => {
		setMobileMenuAnchor(null);
	}, []);

	const currentDiagramName = useMemo(() => {
		if (!currentDiagramId) return null;
		return savedDiagrams.find((d) => d.id === currentDiagramId)?.name ?? null;
	}, [currentDiagramId, savedDiagrams]);

	const presentationHref = useMemo(
		() =>
			`/presentation?diagram=${encodeURIComponent(
				compressToBase64(mermaidCode),
			)}`,
		[mermaidCode],
	);

	const createDiagram = useCallback(() => {
		dispatch(createNewDiagram());
	}, [dispatch]);

	const showTemplateDialog = useCallback(() => {
		setIsTemplateDialogOpen(true);
	}, []);

	const openLoadDialog = useCallback(() => {
		dispatch(setLoadDialogOpen(true));
	}, [dispatch]);

	const showHowToUse = useCallback(() => {
		setOpenHowToUse(true);
	}, []);

	const enterPresentation = useCallback(() => {
		router.push(presentationHref);
	}, [presentationHref, router]);

	const shortcuts = useAppShortcuts({
		onShortcutStart: handleMobileMenuClose,
		onNewDiagram: createDiagram,
		onOpenTemplates: showTemplateDialog,
		onOpenSaved: openLoadDialog,
		onSaveDiagram: handleSave,
		onEnterPresentation: enterPresentation,
		onOpenHelp: showHowToUse,
	});

	const handleNewDiagram = useCallback(() => {
		handleMobileMenuClose();
		createDiagram();
	}, [createDiagram, handleMobileMenuClose]);

	const handleOpenTemplates = useCallback(() => {
		handleMobileMenuClose();
		showTemplateDialog();
	}, [handleMobileMenuClose, showTemplateDialog]);

	const handleOpenLoad = useCallback(() => {
		handleMobileMenuClose();
		openLoadDialog();
	}, [handleMobileMenuClose, openLoadDialog]);

	const handleOpenSave = useCallback(() => {
		handleMobileMenuClose();
		handleSave();
	}, [handleMobileMenuClose, handleSave]);

	const handleOpenHelp = useCallback(() => {
		handleMobileMenuClose();
		showHowToUse();
	}, [handleMobileMenuClose, showHowToUse]);

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
							<Tooltip title={`New Diagram (${shortcuts.newDiagram})`}>
								<IconButton
									onClick={createDiagram}
									aria-label="New Diagram"
									size="medium"
								>
									<Plus size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title={`Browse Templates (${shortcuts.openTemplates})`}>
								<IconButton
									onClick={showTemplateDialog}
									aria-label="Browse Templates"
									size="medium"
								>
									<FileText size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title={`Open Saved Diagram (${shortcuts.openSaved})`}>
								<IconButton
									aria-label="Open Saved Diagram"
									size="medium"
									onClick={openLoadDialog}
								>
									<Badge badgeContent={savedDiagrams.length} color="primary">
										<FolderOpen size={20} />
									</Badge>
								</IconButton>
							</Tooltip>

							<Tooltip
								title={
									currentDiagramId
										? hasUnsavedChanges
											? `Update Saved Diagram (${shortcuts.saveDiagram})`
											: "Diagram Saved"
										: `Save Diagram (${shortcuts.saveDiagram})`
								}
							>
								<IconButton
									onClick={handleSave}
									aria-label={
										currentDiagramId ? "Update Saved Diagram" : "Save Diagram"
									}
									size="medium"
									color={hasUnsavedChanges ? "warning" : "default"}
								>
									<Save size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title={`Enter Presentation (${shortcuts.presentation})`}>
								<IconButton
									component={Link}
									href={presentationHref}
									aria-label="Enter Presentation"
									size="medium"
								>
									<Monitor size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title={`How to Use (${shortcuts.help})`}>
								<IconButton
									onClick={showHowToUse}
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
									<Tooltip title={`Save (${shortcuts.saveDiagram})`}>
										<IconButton
											onClick={handleSave}
											aria-label="Save Diagram"
											size="medium"
											color={hasUnsavedChanges ? "warning" : "default"}
										>
											<Save size={20} />
										</IconButton>
									</Tooltip>

									<Tooltip title={`Open (${shortcuts.openSaved})`}>
										<IconButton
											aria-label="Open Saved Diagram"
											size="medium"
											onClick={openLoadDialog}
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
					<ListItemText
						primary="New Diagram"
						secondary={shortcuts.newDiagram}
					/>
				</MenuItem>

				<MenuItem onClick={handleOpenTemplates}>
					<ListItemIcon>
						<FileText size={20} />
					</ListItemIcon>
					<ListItemText
						primary="Browse Templates"
						secondary={shortcuts.openTemplates}
					/>
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
							secondary={`${shortcuts.openSaved} • ${savedDiagrams.length} saved`}
						/>
					</MenuItem>
				)}

				{isMobile && (
					<MenuItem onClick={handleOpenSave}>
						<ListItemIcon>
							<Save size={20} />
						</ListItemIcon>
						<ListItemText
							primary={currentDiagramId ? "Update" : "Save"}
							secondary={
								hasUnsavedChanges ? "Unsaved changes" : shortcuts.saveDiagram
							}
						/>
					</MenuItem>
				)}

				<Divider />

				<MenuItem onClick={handleOpenHelp}>
					<ListItemIcon>
						<HelpCircle size={20} />
					</ListItemIcon>
					<ListItemText primary="How to Use" secondary={shortcuts.help} />
				</MenuItem>

				<MenuItem
					component={Link}
					href={presentationHref}
					onClick={handleMobileMenuClose}
				>
					<ListItemIcon>
						<Monitor size={20} />
					</ListItemIcon>
					<ListItemText
						primary="Enter Presentation"
						secondary={shortcuts.presentation}
					/>
				</MenuItem>

				<MenuItem
					component="a"
					href="https://github.com/sametcn99/mermaid-viewer"
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

			<LoadDiagramDialog />

			<HowToUseDialog
				open={openHowToUse}
				onClose={() => setOpenHowToUse(false)}
			/>

			<TemplateDialog
				open={isTemplateDialogOpen}
				onClose={() => setIsTemplateDialogOpen(false)}
				onSelectTemplate={(code, name) => {
					dispatch(selectTemplateDiagram({ code, name }));
					setIsTemplateDialogOpen(false);
				}}
				currentDiagramCode={mermaidCode}
				currentDiagramName={currentDiagramName ?? undefined}
			/>
		</>
	);
}
