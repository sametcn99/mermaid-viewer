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
	Button,
	CircularProgress,
} from "@mui/material";
import {
	FolderOpen,
	Plus,
	Save,
	HelpCircle,
	FileText,
	MenuIcon,
	Check,
	Palette,
	LogIn,
	Home,
} from "lucide-react";
import type React from "react";
import {
	useEffect,
	useMemo,
	useState,
	useId,
	useCallback,
	useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Monitor } from "lucide-react";
import SaveDiagramDialog from "./SaveDiagramDialog";
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
import ThemeSettingsDialog from "./ThemeSettingsDialog";
import { useAppShortcuts } from "@/hooks/useAppShortcuts";
import {
	LoginDialog,
	RegisterDialog,
	UserMenu,
	AccountSettingsDialog,
} from "./Auth";
import {
	selectIsAuthenticated,
	selectCanUseLocalData,
	selectIsLocalOnly,
	selectAuthInitialized,
	initializeAuth,
} from "@/store/authSlice";
import { requestImmediateSync } from "@/lib/sync";
import { loadStoredDiagramSettings } from "@/lib/diagram-settings";
import { subscribeToUrlUpdates } from "@/lib/utils/url.utils";
import { useAnalytics } from "@/hooks/useAnalytics";

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
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const canUseLocalData = useAppSelector(selectCanUseLocalData);
	const isLocalOnly = useAppSelector(selectIsLocalOnly);
	const authInitialized = useAppSelector(selectAuthInitialized);
	const { track } = useAnalytics();

	const [openDialog, setOpenDialog] = useState(false);
	const [diagramName, setDiagramName] = useState("");
	const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
	const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
		null,
	);
	const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
	const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
	const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
	const [presentationSearch, setPresentationSearch] = useState("");
	const mobileMenuId = useId();

	// Initialize auth on mount
	useEffect(() => {
		if (!authInitialized) {
			dispatch(initializeAuth());
		}
	}, [authInitialized, dispatch]);

	useEffect(() => {
		let isMounted = true;
		const loadData = async () => {
			if (typeof window !== "undefined") {
				void dispatch(refreshSavedDiagrams());
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

	useEffect(() => {
		if (typeof window === "undefined") return;
		setPresentationSearch(window.location.search);
		const unsubscribe = subscribeToUrlUpdates(() => {
			setPresentationSearch(window.location.search);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	const refreshDiagrams = useCallback(() => {
		void dispatch(refreshSavedDiagrams());
	}, [dispatch]);

	// Auto-sync on auth initialization if authenticated
	const hasRequestedInitialSync = useRef(false);
	useEffect(() => {
		if (
			authInitialized &&
			isAuthenticated &&
			!hasRequestedInitialSync.current
		) {
			hasRequestedInitialSync.current = true;
			requestImmediateSync("auth-initial-sync");
		}

		if (!isAuthenticated) {
			hasRequestedInitialSync.current = false;
		}
	}, [authInitialized, isAuthenticated]);

	// Sync on login
	const handleAuthSuccess = useCallback(() => {
		requestImmediateSync("auth-success");
	}, []);

	const handleRequireAuth = useCallback(
		(message?: string) => {
			if (canUseLocalData) {
				if (message) {
					dispatch(setCustomAlertMessage(message));
				}
				return;
			}
			if (message) {
				dispatch(setCustomAlertMessage(message));
			}
			track("signin_required_dialog_open", { message: message || "unknown" });
			setIsLoginDialogOpen(true);
		},
		[canUseLocalData, dispatch, track],
	);

	useEffect(() => {
		const listener = (event: Event) => {
			const detail = (event as CustomEvent<{ message?: string }>).detail;
			handleRequireAuth(detail?.message);
		};

		window.addEventListener("requestAuthentication", listener as EventListener);

		return () => {
			window.removeEventListener(
				"requestAuthentication",
				listener as EventListener,
			);
		};
	}, [handleRequireAuth]);

	const handleSave = useCallback(() => {
		track("appbar_save_click");
		if (!canUseLocalData) {
			handleRequireAuth("Sign in or continue locally to save diagrams.");
			return;
		}

		if (currentDiagramId) {
			dispatch(saveDiagramChanges(currentDiagramId));
			return;
		}

		setOpenDialog(true);
		setDiagramName(`Untitled Diagram ${savedDiagrams.length + 1}`);
	}, [
		canUseLocalData,
		currentDiagramId,
		dispatch,
		handleRequireAuth,
		savedDiagrams.length,
		track,
	]);

	const handleSaveSubmit = useCallback(async () => {
		if (!canUseLocalData) {
			handleRequireAuth("Sign in or continue locally to save diagrams.");
			return;
		}

		const settings = await loadStoredDiagramSettings();
		const diagram = await saveDiagramToStorage(diagramName, mermaidCode, {
			settings,
		});
		refreshDiagrams();
		setOpenDialog(false);
		dispatch(setCustomCurrentDiagramId(diagram.id));
		dispatch(setCustomUnsavedChanges(false));
		dispatch(setCustomAlertMessage("Diagram saved"));
		requestImmediateSync("diagram-saved");
	}, [
		canUseLocalData,
		diagramName,
		dispatch,
		handleRequireAuth,
		mermaidCode,
		refreshDiagrams,
	]);

	const handleMobileMenuOpen = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			track("appbar_mobile_menu_open");
			setMobileMenuAnchor(event.currentTarget);
		},
		[track],
	);

	const handleMobileMenuClose = useCallback(() => {
		setMobileMenuAnchor(null);
	}, []);

	const currentDiagramName = useMemo(() => {
		if (!currentDiagramId) return null;
		return savedDiagrams.find((d) => d.id === currentDiagramId)?.name ?? null;
	}, [currentDiagramId, savedDiagrams]);

	const presentationHref = useMemo(() => {
		if (presentationSearch) {
			return `/presentation${presentationSearch}`;
		}
		return `/presentation?diagram=${encodeURIComponent(
			compressToBase64(mermaidCode),
		)}`;
	}, [mermaidCode, presentationSearch]);

	const createDiagram = useCallback(() => {
		track("appbar_new_diagram_click");
		dispatch(createNewDiagram());
	}, [dispatch, track]);

	const showTemplateDialog = useCallback(() => {
		track("appbar_templates_click");
		setIsTemplateDialogOpen(true);
	}, [track]);

	const openLoadDialog = useCallback(() => {
		track("appbar_open_saved_click");
		if (!canUseLocalData) {
			handleRequireAuth("Sign in or continue locally to open saved diagrams.");
			return;
		}
		dispatch(setLoadDialogOpen(true));
	}, [canUseLocalData, dispatch, handleRequireAuth, track]);

	const enterPresentation = useCallback(() => {
		router.push(presentationHref);
	}, [presentationHref, router]);

	const goToHome = useCallback(() => {
		router.push("/home");
	}, [router]);

	const shortcuts = useAppShortcuts({
		onShortcutStart: handleMobileMenuClose,
		onNewDiagram: createDiagram,
		onOpenTemplates: showTemplateDialog,
		onOpenSaved: openLoadDialog,
		onSaveDiagram: handleSave,
		onEnterPresentation: enterPresentation,
		onOpenHelp: goToHome,
	});

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
		goToHome();
	}, [handleMobileMenuClose, goToHome]);

	const handleOpenLogin = useCallback(() => {
		track("signin_nav_click");
		setIsLoginDialogOpen(true);
	}, [track]);

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
								color: "text.primary",
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
									color: "text.secondary",
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

							{canUseLocalData && (
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
							)}

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
									onClick={() => track("appbar_presentation_click")}
									aria-label="Enter Presentation"
									size="medium"
								>
									<Monitor size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title="Theme Settings">
								<IconButton
									onClick={() => {
										track("appbar_theme_settings_click");
										setIsThemeDialogOpen(true);
									}}
									aria-label="Theme Settings"
									size="medium"
								>
									<Palette size={20} />
								</IconButton>
							</Tooltip>

							<Tooltip title={`Home (${shortcuts.help})`}>
								<IconButton
									component={Link}
									href="/home"
									onClick={() => track("appbar_home_click")}
									aria-label="Home"
									size="medium"
								>
									<Home size={20} />
								</IconButton>
							</Tooltip>

							<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

							{!authInitialized ? (
								<CircularProgress size={24} />
							) : isAuthenticated || isLocalOnly ? (
								<UserMenu
									onOpenSettings={() => setIsAccountSettingsOpen(true)}
									onSignIn={() => setIsLoginDialogOpen(true)}
								/>
							) : (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Button
										variant="contained"
										size="small"
										startIcon={<LogIn size={16} />}
										onClick={() => setIsLoginDialogOpen(true)}
									>
										Sign In
									</Button>
								</Box>
							)}
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

									{canUseLocalData && (
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
									)}
								</>
							)}

							{!authInitialized ? (
								<CircularProgress size={20} />
							) : isAuthenticated || isLocalOnly ? (
								<UserMenu
									onOpenSettings={() => setIsAccountSettingsOpen(true)}
									onSignIn={handleOpenLogin}
								/>
							) : (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Button
										variant="contained"
										size="small"
										startIcon={<LogIn size={16} />}
										onClick={handleOpenLogin}
									>
										Sign In
									</Button>
								</Box>
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
				<MenuItem
					onClick={() => {
						handleMobileMenuClose();
						createDiagram();
					}}
				>
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

				{isMobile && canUseLocalData && (
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

				{authInitialized && !isAuthenticated && !isLocalOnly && (
					<MenuItem
						onClick={() => {
							handleMobileMenuClose();
							handleOpenLogin();
						}}
					>
						<ListItemIcon>
							<LogIn size={20} />
						</ListItemIcon>
						<ListItemText primary="Sign In" />
					</MenuItem>
				)}

				<MenuItem component={Link} href="/home" onClick={handleMobileMenuClose}>
					<ListItemIcon>
						<Home size={20} />
					</ListItemIcon>
					<ListItemText primary="Home" />
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
					onClick={() => {
						handleMobileMenuClose();
						setIsThemeDialogOpen(true);
					}}
				>
					<ListItemIcon>
						<Palette size={20} />
					</ListItemIcon>
					<ListItemText primary="Theme Settings" />
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

			<ThemeSettingsDialog
				open={isThemeDialogOpen}
				onClose={() => setIsThemeDialogOpen(false)}
			/>

			<LoginDialog
				open={isLoginDialogOpen}
				onClose={() => setIsLoginDialogOpen(false)}
				onSwitchToRegister={() => setIsRegisterDialogOpen(true)}
				onLoginSuccess={handleAuthSuccess}
			/>

			<RegisterDialog
				open={isRegisterDialogOpen}
				onClose={() => setIsRegisterDialogOpen(false)}
				onSwitchToLogin={() => setIsLoginDialogOpen(true)}
				onRegisterSuccess={handleAuthSuccess}
			/>

			<AccountSettingsDialog
				open={isAccountSettingsOpen}
				onClose={() => setIsAccountSettingsOpen(false)}
			/>
		</>
	);
}
