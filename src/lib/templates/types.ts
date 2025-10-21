/**
 * Type definitions for diagram templates
 */

export interface DiagramTemplate {
	id: string;
	name: string;
	category: TemplateCategory;
	description: string;
	code: string;
	tags: string[];
}

export type TemplateCategory =
	| "Flowchart"
	| "Sequence"
	| "Class"
	| "ER Diagram"
	| "Gantt"
	| "State"
	| "Pie Chart"
	| "Git Graph"
	| "Mindmap"
	| "Timeline"
	| "Quadrant Chart"
	| "User Journey"
	| "C4 Diagram"
	| "Sankey"
	| "Requirement"
	| "XY Chart"
	| "Block"
	| "Packet";

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
	"Flowchart",
	"Sequence",
	"Class",
	"ER Diagram",
	"Gantt",
	"State",
	"Pie Chart",
	"Git Graph",
	"Mindmap",
	"Timeline",
	"Quadrant Chart",
	"User Journey",
	"C4 Diagram",
	"Sankey",
	"Requirement",
	"XY Chart",
	"Block",
	"Packet",
];
