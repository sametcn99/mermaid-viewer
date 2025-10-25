"use client";

import { useId } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";

import type { TemplateCollection } from "@/lib/utils/local-storage/templates.storage";
import { NEW_COLLECTION_OPTION } from "./constants";

interface SaveCurrentDiagramDialogProps {
	open: boolean;
	templateName: string;
	onTemplateNameChange: (value: string) => void;
	selectedCollectionId: string;
	onSelectedCollectionChange: (collectionId: string) => void;
	newCollectionName: string;
	onNewCollectionNameChange: (value: string) => void;
	collections: TemplateCollection[];
	onClose: () => void;
	onSubmit: () => void;
	canSubmit: boolean;
}

export function SaveCurrentDiagramDialog({
	open,
	templateName,
	onTemplateNameChange,
	selectedCollectionId,
	onSelectedCollectionChange,
	newCollectionName,
	onNewCollectionNameChange,
	collections,
	onClose,
	onSubmit,
	canSubmit,
}: SaveCurrentDiagramDialogProps) {
	const collectionLabelId = useId();

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Save Current Diagram</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField
						autoFocus
						fullWidth
						label="Template name"
						value={templateName}
						onChange={(event) => onTemplateNameChange(event.target.value)}
					/>
					<FormControl fullWidth>
						<InputLabel id={collectionLabelId}>Collection</InputLabel>
						<Select
							labelId={collectionLabelId}
							label="Collection"
							value={selectedCollectionId}
							onChange={(event) =>
								onSelectedCollectionChange(event.target.value)
							}
						>
							{collections.map((collection) => (
								<MenuItem key={collection.id} value={collection.id}>
									{collection.name}
								</MenuItem>
							))}
							<MenuItem value={NEW_COLLECTION_OPTION}>
								<em>Create new collection…</em>
							</MenuItem>
						</Select>
					</FormControl>
					{selectedCollectionId === NEW_COLLECTION_OPTION && (
						<TextField
							fullWidth
							label="New collection name"
							value={newCollectionName}
							onChange={(event) =>
								onNewCollectionNameChange(event.target.value)
							}
						/>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={onSubmit} disabled={!canSubmit}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
