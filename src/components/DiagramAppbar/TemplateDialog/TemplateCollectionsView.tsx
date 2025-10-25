"use client";

import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	IconButton,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import { FileText, FolderPlus, Pencil, Trash2, X } from "lucide-react";

import type {
	CustomTemplate,
	TemplateCollection,
} from "@/lib/utils/local-storage/templates.storage";
import type { CollectionWithEntries, CollectionEntry } from "./types";

interface TemplateCollectionsViewProps {
	collections: CollectionWithEntries[];
	onRenameCollection: (collection: TemplateCollection) => void;
	onDeleteCollection: (collectionId: string) => void;
	onSelectLibraryTemplate: (templateId: string) => void;
	onSelectCustomTemplate: (template: CustomTemplate) => void;
	onRemoveLibraryTemplate: (collectionId: string, templateId: string) => void;
	onRemoveCustomTemplate: (collectionId: string, templateId: string) => void;
	onCreateCollection: () => void;
}

export function TemplateCollectionsView({
	collections,
	onRenameCollection,
	onDeleteCollection,
	onSelectLibraryTemplate,
	onSelectCustomTemplate,
	onRemoveLibraryTemplate,
	onRemoveCustomTemplate,
	onCreateCollection,
}: TemplateCollectionsViewProps) {
	const theme = useTheme();
	const baseChipStyles = {
		borderColor: theme.palette.divider,
		transition: theme.transitions.create(["background-color", "border-color"], {
			duration: theme.transitions.duration.shortest,
		}),
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
			borderColor: theme.palette.primary.main,
		},
	};

	if (collections.length === 0) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					gap: 2,
					textAlign: "center",
					py: 6,
				}}
			>
				<FolderPlus size={56} opacity={0.25} />
				<Typography variant="h6">No collections yet</Typography>
				<Typography variant="body2" color="text.secondary">
					Group templates you reuse often into personal folders.
				</Typography>
				<Button
					variant="contained"
					startIcon={<FolderPlus size={16} />}
					onClick={onCreateCollection}
				>
					Create your first collection
				</Button>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: {
					xs: "1fr",
					md: "repeat(2, 1fr)",
				},
				gap: 2,
			}}
		>
			{collections.map((collection) => (
				<Card
					key={collection.id}
					variant="outlined"
					sx={{
						display: "flex",
						flexDirection: "column",
						bgcolor: "transparent",
						height: "100%",
					}}
				>
					<CardContent sx={{ flexGrow: 1 }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<Box>
								<Typography variant="h6">{collection.name}</Typography>
								<Typography variant="body2" color="text.secondary">
									{collection.entries.length
										? `${collection.entries.length} template${collection.entries.length !== 1 ? "s" : ""}`
										: "No templates saved yet"}
								</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
								}}
							>
								<Tooltip title="Rename collection">
									<IconButton
										size="small"
										onClick={() => onRenameCollection(collection)}
									>
										<Pencil size={16} />
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete collection">
									<IconButton
										size="small"
										onClick={() => {
											if (
												window.confirm(
													`Delete collection "${collection.name}"? This action cannot be undone.`,
												)
											) {
												onDeleteCollection(collection.id);
											}
										}}
									>
										<Trash2 size={16} />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
						<Box
							sx={{
								mt: 2,
								display: "flex",
								flexWrap: "wrap",
								gap: 1,
							}}
						>
							{collection.entries.length === 0 ? (
								<Typography variant="body2" color="text.secondary">
									Add templates using the folder icon or save your current
									diagram into this collection.
								</Typography>
							) : (
								collection.entries.map((entry: CollectionEntry) => {
									if (entry.kind === "custom") {
										const template = entry.template;
										return (
											<Chip
												key={`${collection.id}-custom-${template.id}`}
												label={template.name}
												icon={<FileText size={14} />}
												variant="outlined"
												clickable
												onClick={() => onSelectCustomTemplate(template)}
												onDelete={() =>
													window.confirm(
														`Remove "${template.name}" from "${collection.name}"?`,
													) &&
													onRemoveCustomTemplate(collection.id, template.id)
												}
												deleteIcon={<X size={14} />}
												sx={{
													...baseChipStyles,
													"& .MuiChip-icon": {
														color: theme.palette.primary.main,
													},
												}}
											/>
										);
									}

									const template = entry.template;
									return (
										<Chip
											key={`${collection.id}-library-${template.id}`}
											label={template.name}
											variant="outlined"
											clickable
											onClick={() => onSelectLibraryTemplate(template.id)}
											onDelete={() => {
												if (
													window.confirm(
														`Remove "${template.name}" from "${collection.name}"?`,
													)
												) {
													onRemoveLibraryTemplate(collection.id, template.id);
												}
											}}
											deleteIcon={<X size={14} />}
											sx={baseChipStyles}
										/>
									);
								})
							)}
						</Box>
					</CardContent>
				</Card>
			))}
		</Box>
	);
}
