"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type MouseEvent,
} from "react";

import {
	Box,
	Button,
	Dialog,
	DialogContent,
	Divider,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";

import {
	DIAGRAM_TEMPLATES,
	getTemplateById,
	searchTemplates,
	type DiagramTemplate,
	type TemplateCategory,
} from "@/lib/templates";
import type {
	CustomTemplate,
	TemplateCollection,
} from "@/lib/indexed-db/templates.storage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
	selectCanUseLocalData,
} from "@/store/authSlice";
import {
	addCustomTemplateToCollectionThunk,
	addTemplateToCollectionThunk,
	createTemplateCollectionThunk,
	deleteTemplateCollectionThunk,
	refreshTemplateCollections,
	removeCustomTemplateFromCollectionThunk,
	removeTemplateFromCollectionThunk,
	renameTemplateCollectionThunk,
} from "@/store/templateCollectionsSlice";

import { TemplateCollectionMenu } from "./TemplateCollectionMenu";
import { TemplateCollectionsView } from "./TemplateCollectionsView";
import { ManageCollectionDialog } from "./ManageCollectionDialog";
import { SaveCurrentDiagramDialog } from "./SaveCurrentDiagramDialog";
import { TemplateDialogHeader } from "./TemplateDialogHeader";
import { TemplateDialogSidebar } from "./TemplateDialogSidebar";
import { TemplateLibraryView } from "./TemplateLibraryView";
import { NEW_COLLECTION_OPTION } from "./constants";
import type {
	CollectionEntry,
	CollectionWithEntries,
	DialogCategory,
	TemplateDialogProps,
} from "./types";

export default function TemplateDialog({
	open,
	onClose,
	onSelectTemplate,
	currentDiagramCode,
	currentDiagramName,
}: TemplateDialogProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useDispatch<AppDispatch>();
	const collections = useSelector(
		(state: RootState) => state.templateCollections.collections,
	);
	const canUseLocalData = useSelector(selectCanUseLocalData);

	const requestAuthentication = useCallback((message: string) => {
		window.dispatchEvent(
			new CustomEvent("requestAuthentication", {
				detail: { message },
			}),
		);
	}, []);

	const ensureAuthenticated = useCallback(
		(message: string) => {
			if (canUseLocalData) {
				return true;
			}

			requestAuthentication(message);
			return false;
		},
		[canUseLocalData, requestAuthentication],
	);

	const createCollection = useCallback(
		(name: string) => {
			return dispatch(createTemplateCollectionThunk(name));
		},
		[dispatch],
	);

	const renameCollection = useCallback(
		(id: string, name: string) => {
			return dispatch(renameTemplateCollectionThunk(id, name));
		},
		[dispatch],
	);

	const deleteStoredCollection = useCallback(
		(id: string) => {
			return dispatch(deleteTemplateCollectionThunk(id));
		},
		[dispatch],
	);

	const addTemplate = useCallback(
		(collectionId: string, templateId: string) => {
			return dispatch(addTemplateToCollectionThunk(collectionId, templateId));
		},
		[dispatch],
	);

	const removeTemplate = useCallback(
		(collectionId: string, templateId: string) => {
			return dispatch(
				removeTemplateFromCollectionThunk(collectionId, templateId),
			);
		},
		[dispatch],
	);

	const addCustomTemplate = useCallback(
		(collectionId: string, template: { name: string; code: string }) => {
			return dispatch(
				addCustomTemplateToCollectionThunk(collectionId, template),
			);
		},
		[dispatch],
	);

	const removeCustomTemplate = useCallback(
		(collectionId: string, customTemplateId: string) => {
			return dispatch(
				removeCustomTemplateFromCollectionThunk(collectionId, customTemplateId),
			);
		},
		[dispatch],
	);

	useEffect(() => {
		void dispatch(refreshTemplateCollections());
	}, [dispatch]);

	useEffect(() => {
		if (open) {
			void dispatch(refreshTemplateCollections());
		}
	}, [dispatch, open]);

	const [selectedCategory, setSelectedCategory] =
		useState<DialogCategory>("All");
	const [searchQuery, setSearchQuery] = useState("");

	const [collectionMenuAnchorEl, setCollectionMenuAnchorEl] =
		useState<HTMLElement | null>(null);
	const [templatePendingAssignment, setTemplatePendingAssignment] =
		useState<DiagramTemplate | null>(null);

	const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
	const [collectionDialogMode, setCollectionDialogMode] = useState<
		"create" | "rename"
	>("create");
	const [collectionNameInput, setCollectionNameInput] = useState("");
	const [collectionBeingEdited, setCollectionBeingEdited] =
		useState<TemplateCollection | null>(null);

	const [saveCurrentDialogOpen, setSaveCurrentDialogOpen] = useState(false);
	const [saveCurrentName, setSaveCurrentName] = useState("");
	const [saveCurrentCollectionId, setSaveCurrentCollectionId] =
		useState<string>(NEW_COLLECTION_OPTION);
	const [saveCurrentNewCollectionName, setSaveCurrentNewCollectionName] =
		useState("");

	const hasCurrentDiagram =
		Boolean(currentDiagramCode) && Boolean(currentDiagramCode?.trim());

	type LibraryEntry = Extract<CollectionEntry, { kind: "library" }>;
	type CustomEntry = Extract<CollectionEntry, { kind: "custom" }>;

	const collectionTemplateCount = useMemo(() => {
		return collections.reduce((total, collection) => {
			const customCount = collection.customTemplates?.length ?? 0;
			return total + collection.templateIds.length + customCount;
		}, 0);
	}, [collections]);

	const collectionsWithEntries = useMemo<CollectionWithEntries[]>(() => {
		return collections.map((collection) => {
			const libraryEntries: LibraryEntry[] = collection.templateIds
				.map((templateId) => getTemplateById(templateId))
				.filter((template): template is DiagramTemplate => Boolean(template))
				.map((template) => ({ kind: "library", template }));

			const customEntries: CustomEntry[] = (
				collection.customTemplates ?? []
			).map((template: CustomTemplate) => ({
				kind: "custom",
				template,
			}));

			return {
				...collection,
				entries: [...libraryEntries, ...customEntries],
			};
		});
	}, [collections]);

	const isCollectionsView = selectedCategory === "Collections";
	const hasCollections = collections.length > 0;

	useEffect(() => {
		if (!open) return;
		const defaultName =
			(currentDiagramName && currentDiagramName.trim().length > 0
				? currentDiagramName.trim()
				: "Current Diagram") ?? "Current Diagram";
		setSaveCurrentName(defaultName);

		if (collections.length > 0) {
			setSaveCurrentCollectionId(collections[0].id);
		} else {
			setSaveCurrentCollectionId(NEW_COLLECTION_OPTION);
		}
		setSaveCurrentNewCollectionName("");
	}, [collections, currentDiagramName, open]);

	const filteredTemplates = useMemo(() => {
		if (isCollectionsView) {
			return [];
		}

		let templates = DIAGRAM_TEMPLATES;
		const activeCategory =
			!isCollectionsView && selectedCategory !== "All"
				? (selectedCategory as TemplateCategory)
				: undefined;

		if (activeCategory) {
			templates = templates.filter(
				(template) => template.category === activeCategory,
			);
		}

		if (searchQuery.trim()) {
			templates = searchTemplates(searchQuery);
			if (activeCategory) {
				templates = templates.filter(
					(template) => template.category === activeCategory,
				);
			}
		}

		return templates;
	}, [isCollectionsView, searchQuery, selectedCategory]);

	const handleCategoryChange = useCallback((category: DialogCategory) => {
		setSelectedCategory(category);
		if (category === "Collections") {
			setSearchQuery("");
		}
	}, []);

	const handleOpenCollectionMenu = useCallback(
		(event: MouseEvent<HTMLButtonElement>, template: DiagramTemplate) => {
			event.stopPropagation();
			setCollectionMenuAnchorEl(event.currentTarget);
			setTemplatePendingAssignment(template);
		},
		[],
	);

	const handleCloseCollectionMenu = useCallback(() => {
		setCollectionMenuAnchorEl(null);
		setTemplatePendingAssignment(null);
	}, []);

	const handleAddTemplateToCollection = useCallback(
		(collectionId: string) => {
			if (!templatePendingAssignment) return;
			if (!ensureAuthenticated("Sign in to manage template collections.")) {
				handleCloseCollectionMenu();
				return;
			}
			void addTemplate(collectionId, templatePendingAssignment.id);
			handleCloseCollectionMenu();
		},
		[
			addTemplate,
			ensureAuthenticated,
			handleCloseCollectionMenu,
			templatePendingAssignment,
		],
	);

	const openNewCollectionDialog = useCallback(
		(retainPendingTemplate = false) => {
			if (!retainPendingTemplate) {
				setTemplatePendingAssignment(null);
			}
			setCollectionDialogMode("create");
			setCollectionNameInput("");
			setCollectionBeingEdited(null);
			setCollectionDialogOpen(true);
		},
		[],
	);

	const handleCreateCollectionFromMenu = useCallback(() => {
		if (!ensureAuthenticated("Sign in to manage template collections.")) {
			setCollectionMenuAnchorEl(null);
			return;
		}
		openNewCollectionDialog(true);
		setCollectionMenuAnchorEl(null);
	}, [ensureAuthenticated, openNewCollectionDialog]);

	const handleStartCreateCollection = useCallback(() => {
		if (!ensureAuthenticated("Sign in to manage template collections.")) {
			return;
		}
		openNewCollectionDialog(false);
	}, [ensureAuthenticated, openNewCollectionDialog]);

	const handleEditCollection = useCallback(
		(collection: TemplateCollection) => {
			if (!ensureAuthenticated("Sign in to manage template collections.")) {
				return;
			}
			setCollectionDialogMode("rename");
			setCollectionBeingEdited(collection);
			setCollectionNameInput(collection.name);
			setCollectionDialogOpen(true);
		},
		[ensureAuthenticated],
	);

	const handleDeleteCollection = useCallback(
		(collectionId: string) => {
			if (!ensureAuthenticated("Sign in to manage template collections.")) {
				return;
			}
			void deleteStoredCollection(collectionId);
		},
		[deleteStoredCollection, ensureAuthenticated],
	);

	const handleCollectionDialogClose = useCallback(() => {
		setCollectionDialogOpen(false);
		setCollectionNameInput("");
		setCollectionDialogMode("create");
		setCollectionBeingEdited(null);
		setTemplatePendingAssignment(null);
	}, []);

	const handleCollectionDialogSubmit = useCallback(async () => {
		if (!ensureAuthenticated("Sign in to manage template collections.")) {
			return;
		}
		const trimmedName = collectionNameInput.trim();
		if (!trimmedName) return;

		if (collectionDialogMode === "create") {
			const newCollection = await createCollection(trimmedName);
			if (newCollection && templatePendingAssignment) {
				await addTemplate(newCollection.id, templatePendingAssignment.id);
			}
			handleCollectionDialogClose();
			return;
		}

		if (collectionDialogMode === "rename" && collectionBeingEdited) {
			await renameCollection(collectionBeingEdited.id, trimmedName);
			handleCollectionDialogClose();
		}
	}, [
		addTemplate,
		collectionBeingEdited,
		collectionDialogMode,
		collectionNameInput,
		createCollection,
		ensureAuthenticated,
		handleCollectionDialogClose,
		renameCollection,
		templatePendingAssignment,
	]);

	const handleRemoveTemplateFromCollection = useCallback(
		(collectionId: string, templateId: string) => {
			if (!ensureAuthenticated("Sign in to manage template collections.")) {
				return;
			}
			void removeTemplate(collectionId, templateId);
		},
		[ensureAuthenticated, removeTemplate],
	);

	const handleRemoveCustomTemplateFromCollection = useCallback(
		(collectionId: string, templateId: string) => {
			if (!ensureAuthenticated("Sign in to manage template collections.")) {
				return;
			}
			void removeCustomTemplate(collectionId, templateId);
		},
		[ensureAuthenticated, removeCustomTemplate],
	);

	const handleSelectTemplateByCode = useCallback(
		(code: string, name: string) => {
			onSelectTemplate(code, name);
			onClose();
			setSearchQuery("");
			setSelectedCategory("All");
		},
		[onClose, onSelectTemplate],
	);

	const handleSelectTemplate = useCallback(
		(template: DiagramTemplate) => {
			handleSelectTemplateByCode(template.code, template.name);
		},
		[handleSelectTemplateByCode],
	);

	const handleSelectCustomTemplate = useCallback(
		(template: CustomTemplate) => {
			handleSelectTemplateByCode(template.code, template.name);
		},
		[handleSelectTemplateByCode],
	);

	const handleSelectLibraryTemplateFromCollection = useCallback(
		(templateId: string) => {
			const template = getTemplateById(templateId);
			if (!template) return;
			handleSelectTemplate(template);
		},
		[handleSelectTemplate],
	);

	const handleCloseDialog = useCallback(() => {
		onClose();
		setSearchQuery("");
		setSelectedCategory("All");
	}, [onClose]);

	const handleOpenSaveCurrentDialog = useCallback(() => {
		if (!ensureAuthenticated("Sign in to save diagrams to collections.")) {
			return;
		}
		const fallbackName =
			(currentDiagramName && currentDiagramName.trim().length > 0
				? currentDiagramName.trim()
				: "Current Diagram") ?? "Current Diagram";
		setSaveCurrentName(fallbackName);
		if (collections.length > 0) {
			setSaveCurrentCollectionId(collections[0].id);
		} else {
			setSaveCurrentCollectionId(NEW_COLLECTION_OPTION);
		}
		setSaveCurrentNewCollectionName("");
		setSaveCurrentDialogOpen(true);
	}, [collections, currentDiagramName, ensureAuthenticated]);

	const handleCloseSaveCurrentDialog = useCallback(() => {
		setSaveCurrentDialogOpen(false);
		setSaveCurrentNewCollectionName("");
	}, []);

	const handleSaveCurrentDiagramSubmit = useCallback(async () => {
		if (!ensureAuthenticated("Sign in to save diagrams to collections.")) {
			return;
		}
		if (!hasCurrentDiagram || !currentDiagramCode) return;
		const trimmedName = saveCurrentName.trim();
		if (!trimmedName) return;

		let targetCollectionId = saveCurrentCollectionId;

		if (saveCurrentCollectionId === NEW_COLLECTION_OPTION) {
			const trimmedCollectionName = saveCurrentNewCollectionName.trim();
			if (!trimmedCollectionName) return;
			const newCollection = await createCollection(trimmedCollectionName);
			if (!newCollection) return;
			targetCollectionId = newCollection.id;
			setSelectedCategory("Collections");
			setSaveCurrentCollectionId(newCollection.id);
		}

		await addCustomTemplate(targetCollectionId, {
			name: trimmedName,
			code: currentDiagramCode,
		});
		setSelectedCategory("Collections");
		handleCloseSaveCurrentDialog();
	}, [
		addCustomTemplate,
		createCollection,
		currentDiagramCode,
		ensureAuthenticated,
		hasCurrentDiagram,
		handleCloseSaveCurrentDialog,
		saveCurrentCollectionId,
		saveCurrentName,
		saveCurrentNewCollectionName,
	]);

	const canSaveCurrentDiagram =
		canUseLocalData &&
		hasCurrentDiagram &&
		saveCurrentName.trim().length > 0 &&
		(saveCurrentCollectionId === NEW_COLLECTION_OPTION
			? saveCurrentNewCollectionName.trim().length > 0
			: Boolean(saveCurrentCollectionId));

	return (
		<Dialog
			open={open}
			onClose={handleCloseDialog}
			maxWidth="lg"
			fullWidth
			fullScreen={isMobile}
			PaperProps={{
				sx: {
					height: isMobile ? "100%" : "80vh",
				},
			}}
		>
			<TemplateDialogHeader
				isCollectionsView={isCollectionsView}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onClose={handleCloseDialog}
				onSaveCurrentDiagram={handleOpenSaveCurrentDialog}
				onCreateCollection={handleStartCreateCollection}
				hasCurrentDiagram={hasCurrentDiagram}
			/>
			<Divider />
			<DialogContent sx={{ p: 0, display: "flex", height: "100%" }}>
				<Box
					sx={{
						width: isMobile ? "100%" : 260,
						borderRight: isMobile ? 0 : 1,
						borderColor: "divider",
						overflowY: "auto",
						display: isMobile && selectedCategory !== "All" ? "none" : "block",
					}}
				>
					<TemplateDialogSidebar
						selectedCategory={selectedCategory}
						onCategoryChange={handleCategoryChange}
						hasCollections={hasCollections}
						collectionsCount={collections.length}
						totalSavedTemplates={collectionTemplateCount}
					/>
				</Box>

				<Box
					sx={{
						flex: 1,
						overflowY: "auto",
						p: 2,
						display: isMobile && selectedCategory === "All" ? "none" : "block",
					}}
				>
					{isMobile && selectedCategory !== "All" && (
						<Button
							startIcon={<ArrowLeft size={16} />}
							onClick={() => handleCategoryChange("All")}
							sx={{ mb: 2 }}
						>
							Back to Categories
						</Button>
					)}

					{isCollectionsView ? (
						<TemplateCollectionsView
							collections={collectionsWithEntries}
							onRenameCollection={handleEditCollection}
							onDeleteCollection={handleDeleteCollection}
							onSelectLibraryTemplate={
								handleSelectLibraryTemplateFromCollection
							}
							onSelectCustomTemplate={handleSelectCustomTemplate}
							onRemoveLibraryTemplate={handleRemoveTemplateFromCollection}
							onRemoveCustomTemplate={handleRemoveCustomTemplateFromCollection}
							onCreateCollection={handleStartCreateCollection}
						/>
					) : (
						<TemplateLibraryView
							templates={filteredTemplates}
							onSelectTemplate={handleSelectTemplate}
							onAddToCollection={handleOpenCollectionMenu}
						/>
					)}
				</Box>
			</DialogContent>

			<TemplateCollectionMenu
				anchorEl={collectionMenuAnchorEl}
				collections={collections}
				template={templatePendingAssignment}
				onClose={handleCloseCollectionMenu}
				onAddTemplate={handleAddTemplateToCollection}
				onCreateCollection={handleCreateCollectionFromMenu}
			/>

			<SaveCurrentDiagramDialog
				open={saveCurrentDialogOpen}
				onClose={handleCloseSaveCurrentDialog}
				templateName={saveCurrentName}
				onTemplateNameChange={setSaveCurrentName}
				selectedCollectionId={saveCurrentCollectionId}
				onSelectedCollectionChange={setSaveCurrentCollectionId}
				newCollectionName={saveCurrentNewCollectionName}
				onNewCollectionNameChange={setSaveCurrentNewCollectionName}
				collections={collections}
				onSubmit={handleSaveCurrentDiagramSubmit}
				canSubmit={canSaveCurrentDiagram}
			/>

			<ManageCollectionDialog
				open={collectionDialogOpen}
				mode={collectionDialogMode}
				name={collectionNameInput}
				onNameChange={setCollectionNameInput}
				onClose={handleCollectionDialogClose}
				onSubmit={handleCollectionDialogSubmit}
			/>
		</Dialog>
	);
}
