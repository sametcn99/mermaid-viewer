import type { SavedDiagram } from "@/lib/indexed-db/diagrams.storage";
import {
	compressToBase64,
	decompressFromBase64,
} from "@/lib/utils/compression.utils";
import {
	Box,
	Button,
	CircularProgress,
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
	TextField,
} from "@mui/material";
import { Plus, Share2, Trash, Download, Upload } from "lucide-react";
import JSZip from "jszip";
import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Check, X, Edit } from "lucide-react";
import { updateDiagram } from "@/lib/indexed-db/diagrams.storage";

export interface ImportedDiagramData {
	name: string;
	code: string;
	timestamp: number;
}

interface LoadDiagramDialogProps {
	open: boolean;
	savedDiagrams: SavedDiagram[];
	savedDiagramId?: string;
	onLoadDiagram: (diagram: SavedDiagram) => void;
	onNewDiagram: () => void;
	onDeleteDiagram: (
		id: string,
		event: React.MouseEvent,
	) => void | Promise<void>;
	onClose: () => void;
	formatTimestamp: (timestamp: number) => string;
	onImportDiagrams?: (diagrams: ImportedDiagramData[]) => Promise<void>;
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
	onImportDiagrams,
}) => {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [diagramToDelete, setDiagramToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [showCopyNotification, setShowCopyNotification] = useState(false);
	const [isGeneratingZip, setIsGeneratingZip] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [editingDiagramId, setEditingDiagramId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [isRenaming, setIsRenaming] = useState(false);
	const editingInputRef = useRef<HTMLInputElement | null>(null);

	const sanitizeFileName = (value: string, fallback: string) => {
		const sanitized = value
			.trim()
			.replace(/[^a-zA-Z0-9-_ ]/g, "")
			.replace(/\s+/g, "-");
		return sanitized.length ? sanitized : fallback;
	};

	const triggerFileDownload = (blob: Blob, fileName: string) => {
		if (typeof window === "undefined") return;
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

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

	const handleDownloadDiagram = (
		diagram: SavedDiagram,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();
		if (typeof window === "undefined") return;
		const baseName = sanitizeFileName(
			diagram.name,
			diagram.id.replace(/[^a-zA-Z0-9]/g, ""),
		);
		const blob = new Blob([diagram.code], {
			type: "text/plain;charset=utf-8",
		});
		triggerFileDownload(blob, `${baseName}.mmd`);
	};

	useEffect(() => {
		if (editingDiagramId) {
			// focus the input when entering edit mode
			setTimeout(() => editingInputRef.current?.focus(), 0);
		}
	}, [editingDiagramId]);

	const startRename = (
		diagramId: string,
		currentName: string,
		event: React.MouseEvent,
	) => {
		event.stopPropagation();
		setEditingDiagramId(diagramId);
		setEditingName(currentName);
	};

	const cancelRename = (event?: React.MouseEvent) => {
		event?.stopPropagation();
		setEditingDiagramId(null);
		setEditingName("");
	};

	const confirmRename = async (diagramId: string, event?: React.MouseEvent) => {
		event?.stopPropagation();
		const newName = editingName.trim();
		if (!newName) {
			// don't allow empty names
			return;
		}
		try {
			setIsRenaming(true);
			// update storage; parent should listen to `diagramsChanged` and refresh list
			await updateDiagram(diagramId, { name: newName });
		} catch (err) {
			console.error("Failed to rename diagram:", err);
		} finally {
			setIsRenaming(false);
			setEditingDiagramId(null);
			setEditingName("");
		}
	};

	const handleDownloadAllDiagrams = async () => {
		if (typeof window === "undefined" || !savedDiagrams.length) return;
		setIsGeneratingZip(true);

		try {
			const zip = new JSZip();
			const usedNames = new Set<string>();
			const metadata: Array<{
				name: string;
				createdAt: string;
				compressedCode: string;
				fileName: string;
			}> = [];

			savedDiagrams.forEach((diagram, index) => {
				const fallback = `diagram-${index + 1}`;
				const baseName = sanitizeFileName(
					diagram.name,
					diagram.id.replace(/[^a-zA-Z0-9]/g, "") || fallback,
				);
				let fileName = `${baseName}.mmd`;
				let duplicateCounter = 1;

				while (usedNames.has(fileName)) {
					fileName = `${baseName}-${duplicateCounter}.mmd`;
					duplicateCounter += 1;
				}

				usedNames.add(fileName);
				zip.file(fileName, diagram.code);

				metadata.push({
					name: diagram.name,
					createdAt: new Date(diagram.timestamp).toISOString(),
					compressedCode: compressToBase64(diagram.code),
					fileName,
				});
			});

			zip.file("data.json", JSON.stringify({ diagrams: metadata }, null, 2));

			const blob = await zip.generateAsync({ type: "blob" });
			const downloadName = `mermaid-diagrams-${new Date()
				.toISOString()
				.replace(/[^a-zA-Z0-9]/g, "")}.zip`;
			triggerFileDownload(blob, downloadName);
		} catch (error) {
			console.error("Failed to download diagrams archive:", error);
		} finally {
			setIsGeneratingZip(false);
		}
	};

	const parseDiagramNameFromFile = (fileName: string) =>
		sanitizeFileName(
			fileName.replace(/\.mmd$/i, ""),
			fileName.replace(/[^a-zA-Z0-9]/g, "diagram"),
		);

	const handleProcessZipFile = async (file: File) => {
		const zip = await JSZip.loadAsync(file);
		const metadataMap = new Map<
			string,
			{
				name?: string;
				createdAt?: string;
				compressedCode?: string;
			}
		>();

		const dataFiles = zip.file(/(^|\/)data\.json$/i);
		const dataFile = dataFiles.length ? dataFiles[0] : undefined;
		if (dataFile) {
			try {
				const raw = await dataFile.async("string");
				const parsed = JSON.parse(raw) as {
					diagrams?: Array<{
						name?: string;
						createdAt?: string;
						compressedCode?: string;
						fileName?: string;
					}>;
				};
				parsed.diagrams?.forEach((meta) => {
					if (!meta.fileName) return;
					metadataMap.set(meta.fileName, {
						name: meta.name,
						createdAt: meta.createdAt,
						compressedCode: meta.compressedCode,
					});
				});
			} catch (error) {
				console.error("Failed to parse data.json:", error);
			}
		}

		const imported: ImportedDiagramData[] = [];
		const entries = Object.values(zip.files);
		for (const entry of entries) {
			if (entry.dir) continue;
			const fileName = entry.name.split("/").pop() ?? entry.name;
			if (!/\.mmd$/i.test(fileName)) continue;

			const metadata = metadataMap.get(fileName);
			let code: string | undefined;

			if (metadata?.compressedCode) {
				try {
					code = decompressFromBase64(metadata.compressedCode);
				} catch (error) {
					console.error("Failed to decompress diagram code:", error);
				}
			}

			if (!code) {
				try {
					code = await entry.async("string");
				} catch (error) {
					console.error("Failed to read diagram from zip:", error);
					continue;
				}
			}

			const timestamp = metadata?.createdAt
				? Number.isNaN(Date.parse(metadata.createdAt))
					? Date.now()
					: new Date(metadata.createdAt).getTime()
				: (entry.date?.getTime() ?? Date.now());

			imported.push({
				name: metadata?.name ?? parseDiagramNameFromFile(fileName),
				code,
				timestamp,
			});
		}

		return imported;
	};

	const handleFileSelection = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files?.length || !onImportDiagrams) {
			event.target.value = "";
			return;
		}

		setIsImporting(true);
		try {
			const imported: ImportedDiagramData[] = [];
			for (const file of Array.from(files)) {
				const extension = file.name.split(".").pop()?.toLowerCase();
				if (extension === "zip") {
					try {
						const zipDiagrams = await handleProcessZipFile(file);
						imported.push(...zipDiagrams);
					} catch (error) {
						console.error("Failed to process zip file:", error);
					}
					continue;
				}

				if (extension === "mmd") {
					try {
						const code = await file.text();
						imported.push({
							name: parseDiagramNameFromFile(file.name),
							code,
							timestamp:
								file.lastModified && file.lastModified > 0
									? file.lastModified
									: Date.now(),
						});
					} catch (error) {
						console.error("Failed to read diagram file:", error);
					}
				}
			}

			if (imported.length) {
				await onImportDiagrams(imported);
			}
		} finally {
			setIsImporting(false);
			event.target.value = "";
		}
	};

	const handleUploadClick = () => {
		if (!onImportDiagrams) return;
		fileInputRef.current?.click();
	};

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
				<DialogTitle
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						pr: 1,
					}}
				>
					Saved Diagrams
					<Box sx={{ display: "flex", gap: 1 }}>
						<Tooltip
							title={
								onImportDiagrams
									? "Upload diagrams (.mmd or .zip)"
									: "Import disabled"
							}
							arrow
						>
							<span>
								<Button
									variant="text"
									size="small"
									onClick={handleUploadClick}
									disabled={!onImportDiagrams || isImporting}
									startIcon={
										isImporting ? (
											<CircularProgress size={16} />
										) : (
											<Upload size={16} />
										)
									}
								>
									Upload
								</Button>
							</span>
						</Tooltip>
						<Tooltip
							title={
								savedDiagrams.length
									? "Download all diagrams (.zip)"
									: "No diagrams to download"
							}
							arrow
						>
							<span>
								<Button
									variant="text"
									size="small"
									onClick={handleDownloadAllDiagrams}
									disabled={!savedDiagrams.length || isGeneratingZip}
									startIcon={
										isGeneratingZip ? (
											<CircularProgress size={16} />
										) : (
											<Download size={16} />
										)
									}
								>
									Download All
								</Button>
							</span>
						</Tooltip>
					</Box>
				</DialogTitle>
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
										if (!editingDiagramId) {
											onLoadDiagram(diagram);
											onClose();
										}
									}}
									selected={diagram.id === savedDiagramId}
									sx={{ borderRadius: 1, mb: 1 }}
								>
									{editingDiagramId === diagram.id ? (
										<TextField
											inputRef={editingInputRef}
											value={editingName}
											onChange={(e) => setEditingName(e.target.value)}
											size="small"
											fullWidth
											onKeyDown={(e) => {
												if (e.key === "Enter")
													confirmRename(
														diagram.id,
														e as unknown as React.MouseEvent,
													);
												if (e.key === "Escape")
													cancelRename(e as unknown as React.MouseEvent);
											}}
										/>
									) : (
										<ListItemText
											primary={diagram.name}
											secondary={formatTimestamp(diagram.timestamp)}
										/>
									)}
									<ListItemSecondaryAction>
										{editingDiagramId === diagram.id ? (
											<>
												<Tooltip title="Save name" arrow>
													<span>
														<IconButton
															onClick={(e) => confirmRename(diagram.id, e)}
															aria-label="Save name"
															disabled={isRenaming}
														>
															{isRenaming ? (
																<CircularProgress size={16} />
															) : (
																<Check />
															)}
														</IconButton>
													</span>
												</Tooltip>
												<Tooltip title="Cancel" arrow>
													<IconButton
														onClick={(e) => cancelRename(e)}
														aria-label="Cancel rename"
													>
														<X />
													</IconButton>
												</Tooltip>
											</>
										) : (
											<>
												<Tooltip title="Rename" arrow>
													<IconButton
														onClick={(e) =>
															startRename(diagram.id, diagram.name, e)
														}
														aria-label="Rename diagram"
													>
														<Edit />
													</IconButton>
												</Tooltip>
												<Tooltip title="Download as .mmd" arrow>
													<IconButton
														onClick={(e) => handleDownloadDiagram(diagram, e)}
														aria-label="Download diagram"
													>
														<Download />
													</IconButton>
												</Tooltip>
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
											</>
										)}
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

			<input
				placeholder="Upload diagrams (.mmd or .zip)"
				type="file"
				accept=".mmd,.zip"
				multiple
				ref={fileInputRef}
				onChange={handleFileSelection}
				style={{ display: "none" }}
			/>

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
