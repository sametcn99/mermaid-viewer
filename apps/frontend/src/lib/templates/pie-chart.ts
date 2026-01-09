import type { DiagramTemplate } from "./types";

export const pieChartTemplates: DiagramTemplate[] = [
	{
		id: "pie-basic",
		name: "Basic Distribution",
		category: "Pie Chart",
		description: "Simple percentage distribution",
		tags: ["chart", "distribution", "stats"],
		code: `pie title Project Time Distribution
    "Development" : 45
    "Testing" : 20
    "Documentation" : 15
    "Meetings" : 12
    "Other" : 8`,
	},
	{
		id: "pie-budget",
		name: "Budget Allocation",
		category: "Pie Chart",
		description: "Budget breakdown by category",
		tags: ["budget", "finance", "allocation"],
		code: `pie title Annual Budget Allocation
    "Salaries" : 40
    "Infrastructure" : 25
    "Marketing" : 15
    "Research & Development" : 12
    "Operations" : 8`,
	},
	{
		id: "pie-customer-segments",
		name: "Customer Segments",
		category: "Pie Chart",
		description: "Distribution of customers by primary segment",
		tags: ["customer", "segments", "marketing", "distribution"],
		code: `pie title Customer Segment Distribution
    "Enterprise" : 35
    "Mid-Market" : 25
    "Small Business" : 20
    "Startup" : 12
    "Individual" : 8`,
	},
];
