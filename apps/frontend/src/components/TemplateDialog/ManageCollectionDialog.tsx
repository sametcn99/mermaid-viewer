"use client";

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";

type CollectionDialogMode = "create" | "rename";

interface ManageCollectionDialogProps {
	open: boolean;
	mode: CollectionDialogMode;
	name: string;
	onNameChange: (value: string) => void;
	onClose: () => void;
	onSubmit: () => void;
}

export function ManageCollectionDialog({
	open,
	mode,
	name,
	onNameChange,
	onClose,
	onSubmit,
}: ManageCollectionDialogProps) {
	const isCreate = mode === "create";
	const title = isCreate ? "New Collection" : "Rename Collection";
	const actionLabel = isCreate ? "Create" : "Save";

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					fullWidth
					label="Collection name"
					value={name}
					onChange={(event) => onNameChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							onSubmit();
						}
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={onSubmit} disabled={!name.trim()}>
					{actionLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
