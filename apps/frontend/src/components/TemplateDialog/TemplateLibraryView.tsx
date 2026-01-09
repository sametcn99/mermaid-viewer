"use client";

import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Typography,
} from "@mui/material";
import { FolderPlus, Search } from "lucide-react";

import type { DiagramTemplate } from "@/lib/templates";
import { CATEGORY_ICONS } from "./constants";

interface TemplateLibraryViewProps {
	templates: DiagramTemplate[];
	onSelectTemplate: (template: DiagramTemplate) => void;
	onAddToCollection: (
		event: React.MouseEvent<HTMLButtonElement>,
		template: DiagramTemplate,
	) => void;
}

export function TemplateLibraryView({
	templates,
	onSelectTemplate,
	onAddToCollection,
}: TemplateLibraryViewProps) {
	if (templates.length === 0) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					gap: 2,
				}}
			>
				<Search size={48} opacity={0.3} />
				<Typography variant="h6" color="text.secondary">
					No templates found
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Try adjusting your search or category filter
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: {
					xs: "1fr",
					sm: "repeat(2, 1fr)",
					md: "repeat(3, 1fr)",
				},
				gap: 2,
			}}
		>
			{templates.map((template) => (
				<Card
					key={template.id}
					variant="outlined"
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						transition: "all 0.2s",
						bgcolor: "transparent",
						"&:hover": {
							boxShadow: 4,
						},
					}}
				>
					<CardContent sx={{ flexGrow: 1 }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								mb: 1,
							}}
						>
							{CATEGORY_ICONS[template.category]}
							<Typography variant="h6" component="div">
								{template.name}
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
							{template.description}
						</Typography>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
							{template.tags.map((tag) => (
								<Chip key={tag} label={tag} size="small" variant="outlined" />
							))}
						</Box>
					</CardContent>
					<CardActions
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<Button
							variant="contained"
							onClick={() => onSelectTemplate(template)}
							sx={{ flexGrow: 1 }}
						>
							Use Template
						</Button>
						<Button
							variant="outlined"
							onClick={(event) => onAddToCollection(event, template)}
							size="small"
							startIcon={<FolderPlus size={16} />}
						>
							Add
						</Button>
					</CardActions>
				</Card>
			))}
		</Box>
	);
}
