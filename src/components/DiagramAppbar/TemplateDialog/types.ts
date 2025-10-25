"use client";

import type { DiagramTemplate, TemplateCategory } from "@/lib/templates";
import type {
	CustomTemplate,
	TemplateCollection,
} from "@/lib/utils/local-storage/templates.storage";

export type DialogCategory = TemplateCategory | "All" | "Collections";

export interface TemplateDialogProps {
	open: boolean;
	onClose: () => void;
	onSelectTemplate: (code: string, name: string) => void;
	currentDiagramCode?: string;
	currentDiagramName?: string | null;
}

export type CollectionEntry =
	| { kind: "library"; template: DiagramTemplate }
	| { kind: "custom"; template: CustomTemplate };

export interface CollectionWithEntries extends TemplateCollection {
	entries: CollectionEntry[];
}
