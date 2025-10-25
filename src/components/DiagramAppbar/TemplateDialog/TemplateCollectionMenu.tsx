"use client";

import {
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";
import { Check, FolderPlus } from "lucide-react";

import type { DiagramTemplate } from "@/lib/templates";
import type { TemplateCollection } from "@/lib/indexed-db/templates.storage";

interface TemplateCollectionMenuProps {
	anchorEl: HTMLElement | null;
	collections: TemplateCollection[];
	template?: DiagramTemplate | null;
	onClose: () => void;
	onAddTemplate: (collectionId: string) => void;
	onCreateCollection: () => void;
}

export function TemplateCollectionMenu({
	anchorEl,
	collections,
	template,
	onClose,
	onAddTemplate,
	onCreateCollection,
}: TemplateCollectionMenuProps) {
	const open = Boolean(anchorEl);

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
		>
			{collections.length ? (
				collections.map((collection) => {
					const alreadyContainsTemplate =
						!!template && collection.templateIds.includes(template.id);
					const totalTemplates =
						collection.templateIds.length +
						(collection.customTemplates?.length ?? 0);

					return (
						<MenuItem
							key={collection.id}
							onClick={() => onAddTemplate(collection.id)}
							disabled={!template || alreadyContainsTemplate}
						>
							<ListItemIcon sx={{ minWidth: 28 }}>
								{alreadyContainsTemplate ? <Check size={16} /> : null}
							</ListItemIcon>
							<ListItemText
								primary={collection.name}
								secondary={
									totalTemplates
										? `${totalTemplates} template${totalTemplates !== 1 ? "s" : ""}`
										: "Empty collection"
								}
							/>
						</MenuItem>
					);
				})
			) : (
				<MenuItem disabled>No collections yet</MenuItem>
			)}

			<Divider />
			<MenuItem onClick={onCreateCollection}>
				<ListItemIcon sx={{ minWidth: 28 }}>
					<FolderPlus size={16} />
				</ListItemIcon>
				<ListItemText
					primary="Create new collection"
					secondary={
						template
							? `Add "${template.name}" to a new folder`
							: "Start a fresh collection"
					}
				/>
			</MenuItem>
		</Menu>
	);
}
