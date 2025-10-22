"use client";

import {
	Box,
	Button,
	DialogTitle,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FileText, FolderPlus, Save, Search, X } from "lucide-react";

interface TemplateDialogHeaderProps {
	isCollectionsView: boolean;
	searchQuery: string;
	onSearchChange: (value: string) => void;
	onClose: () => void;
	onSaveCurrentDiagram: () => void;
	onCreateCollection: () => void;
	hasCurrentDiagram: boolean;
}

export function TemplateDialogHeader({
	isCollectionsView,
	searchQuery,
	onSearchChange,
	onClose,
	onSaveCurrentDiagram,
	onCreateCollection,
	hasCurrentDiagram,
}: TemplateDialogHeaderProps) {
	return (
		<DialogTitle>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<FileText size={24} />
					<Typography variant="h6">Browse Templates</Typography>
				</Box>
				<Button
					onClick={onClose}
					size="small"
					startIcon={<X size={16} />}
					variant="text"
					sx={{ minWidth: "auto", px: 1 }}
				>
					Close
				</Button>
			</Box>
			<TextField
				fullWidth
				placeholder="Search templates by name, description, or tags..."
				value={searchQuery}
				onChange={(event) => onSearchChange(event.target.value)}
				size="small"
				sx={{ mt: 2, display: isCollectionsView ? "none" : "block" }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search size={20} />
						</InputAdornment>
					),
				}}
			/>
			{isCollectionsView && (
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={1}
					alignItems={{ xs: "stretch", sm: "center" }}
					justifyContent="space-between"
					sx={{ mt: 2 }}
				>
					<Typography variant="body2" color="text.secondary">
						Organize frequently used templates into personal folders.
					</Typography>
					<Stack
						direction="row"
						spacing={1}
						sx={{ width: { xs: "100%", sm: "auto" } }}
					>
						{hasCurrentDiagram && (
							<Button
								startIcon={<Save size={16} />}
								variant="contained"
								onClick={onSaveCurrentDiagram}
								sx={{ flexGrow: { xs: 1, sm: 0 } }}
							>
								Save Current Diagram
							</Button>
						)}
						<Button
							startIcon={<FolderPlus size={16} />}
							variant="outlined"
							onClick={onCreateCollection}
							sx={{ flexGrow: { xs: 1, sm: 0 } }}
						>
							New Collection
						</Button>
					</Stack>
				</Stack>
			)}
		</DialogTitle>
	);
}
