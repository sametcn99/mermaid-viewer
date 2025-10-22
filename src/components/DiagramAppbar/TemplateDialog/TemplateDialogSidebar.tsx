"use client";

import {
	Box,
	Divider,
	List,
	ListItemButton,
	ListItemText,
	Typography,
} from "@mui/material";
import { Folder } from "lucide-react";

import {
	DIAGRAM_TEMPLATES,
	TEMPLATE_CATEGORIES,
	getTemplateCategoryCount,
	type TemplateCategory,
} from "@/lib/templates";
import { CATEGORY_ICONS } from "./constants";
import type { DialogCategory } from "./types";

interface TemplateDialogSidebarProps {
	selectedCategory: DialogCategory;
	onCategoryChange: (category: DialogCategory) => void;
	hasCollections: boolean;
	collectionsCount: number;
	totalSavedTemplates: number;
}

export function TemplateDialogSidebar({
	selectedCategory,
	onCategoryChange,
	hasCollections,
	collectionsCount,
	totalSavedTemplates,
}: TemplateDialogSidebarProps) {
	const handleSelect = (category: DialogCategory) => {
		onCategoryChange(category);
	};

	return (
		<List>
			<ListItemButton
				selected={selectedCategory === "Collections"}
				onClick={() => handleSelect("Collections")}
			>
				<ListItemText
					primary={
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Folder size={20} />
							<Typography component="span" variant="body1">
								My Collections
							</Typography>
						</Box>
					}
					secondary={
						hasCollections
							? `${collectionsCount} collection${collectionsCount !== 1 ? "s" : ""}${
									totalSavedTemplates
										? ` • ${totalSavedTemplates} saved template${totalSavedTemplates !== 1 ? "s" : ""}`
										: ""
								}`
							: "Create folders for quick access"
					}
				/>
			</ListItemButton>
			<Divider />
			<ListItemButton
				selected={selectedCategory === "All"}
				onClick={() => handleSelect("All")}
			>
				<ListItemText
					primary="All Templates"
					secondary={`${DIAGRAM_TEMPLATES.length} templates`}
				/>
			</ListItemButton>
			<Divider />
			{TEMPLATE_CATEGORIES.map((category: TemplateCategory) => {
				const count = getTemplateCategoryCount(category);
				return (
					<ListItemButton
						key={category}
						selected={selectedCategory === category}
						onClick={() => handleSelect(category)}
					>
						<ListItemText
							primary={
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									{CATEGORY_ICONS[category]}
									<Typography component="span" variant="body1">
										{category}
									</Typography>
								</Box>
							}
							secondary={`${count} template${count !== 1 ? "s" : ""}`}
						/>
					</ListItemButton>
				);
			})}
		</List>
	);
}
