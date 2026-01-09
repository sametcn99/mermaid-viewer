/**
 * Template library for Mermaid diagrams
 * Provides categorized collection of ready-to-use diagram templates
 */

export * from "./types";
export * from "./flowchart";
export * from "./sequence";
export * from "./class";
export * from "./er-diagram";
export * from "./gantt";
export * from "./state";
export * from "./pie-chart";
export * from "./git-graph";
export * from "./mindmap";
export * from "./timeline";
export * from "./quadrant-chart";
export * from "./user-journey";
export * from "./c4-diagram";
export * from "./sankey";
export * from "./requirement";
export * from "./xy-chart";
export * from "./block";
export * from "./packet";

import type { DiagramTemplate, TemplateCategory } from "./types";
import { flowchartTemplates } from "./flowchart";
import { sequenceTemplates } from "./sequence";
import { classTemplates } from "./class";
import { erDiagramTemplates } from "./er-diagram";
import { ganttTemplates } from "./gantt";
import { stateTemplates } from "./state";
import { pieChartTemplates } from "./pie-chart";
import { gitGraphTemplates } from "./git-graph";
import { mindmapTemplates } from "./mindmap";
import { timelineTemplates } from "./timeline";
import { quadrantChartTemplates } from "./quadrant-chart";
import { userJourneyTemplates } from "./user-journey";
import { c4DiagramTemplates } from "./c4-diagram";
import { sankeyTemplates } from "./sankey";
import { requirementTemplates } from "./requirement";
import { xyChartTemplates } from "./xy-chart";
import { blockTemplates } from "./block";
import { packetTemplates } from "./packet";

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
