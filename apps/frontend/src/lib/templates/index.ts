/**
 * Template library for Mermaid diagrams
 * Provides categorized collection of ready-to-use diagram templates
 */

export * from "./block";
export * from "./c4-diagram";
export * from "./class";
export * from "./er-diagram";
export * from "./flowchart";
export * from "./gantt";
export * from "./git-graph";
export * from "./mindmap";
export * from "./packet";
export * from "./pie-chart";
export * from "./quadrant-chart";
export * from "./requirement";
export * from "./sankey";
export * from "./sequence";
export * from "./state";
export * from "./timeline";
export * from "./types";
export * from "./user-journey";
export * from "./xy-chart";

import { blockTemplates } from "./block";
import { c4DiagramTemplates } from "./c4-diagram";
import { classTemplates } from "./class";
import { erDiagramTemplates } from "./er-diagram";
import { flowchartTemplates } from "./flowchart";
import { ganttTemplates } from "./gantt";
import { gitGraphTemplates } from "./git-graph";
import { mindmapTemplates } from "./mindmap";
import { packetTemplates } from "./packet";
import { pieChartTemplates } from "./pie-chart";
import { quadrantChartTemplates } from "./quadrant-chart";
import { requirementTemplates } from "./requirement";
import { sankeyTemplates } from "./sankey";
import { sequenceTemplates } from "./sequence";
import { stateTemplates } from "./state";
import { timelineTemplates } from "./timeline";
import type { DiagramTemplate, TemplateCategory } from "./types";
import { userJourneyTemplates } from "./user-journey";
import { xyChartTemplates } from "./xy-chart";

/**
 * All diagram templates combined
 */
export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
	...flowchartTemplates,
	...sequenceTemplates,
	...classTemplates,
	...erDiagramTemplates,
	...ganttTemplates,
	...stateTemplates,
	...pieChartTemplates,
	...gitGraphTemplates,
	...mindmapTemplates,
	...timelineTemplates,
	...quadrantChartTemplates,
	...userJourneyTemplates,
	...c4DiagramTemplates,
	...sankeyTemplates,
	...requirementTemplates,
	...xyChartTemplates,
	...blockTemplates,
	...packetTemplates,
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
	category: TemplateCategory,
): DiagramTemplate[] {
	return DIAGRAM_TEMPLATES.filter((template) => template.category === category);
}

/**
 * Search templates by query (name, description, tags)
 */
export function searchTemplates(query: string): DiagramTemplate[] {
	const lowerQuery = query.toLowerCase().trim();
	if (!lowerQuery) return DIAGRAM_TEMPLATES;

	return DIAGRAM_TEMPLATES.filter(
		(template) =>
			template.name.toLowerCase().includes(lowerQuery) ||
			template.description.toLowerCase().includes(lowerQuery) ||
			template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
	);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): DiagramTemplate | undefined {
	return DIAGRAM_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get template count by category
 */
export function getTemplateCategoryCount(category: TemplateCategory): number {
	return DIAGRAM_TEMPLATES.filter((template) => template.category === category)
		.length;
}
