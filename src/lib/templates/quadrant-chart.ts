import type { DiagramTemplate } from "./types";

export const quadrantChartTemplates: DiagramTemplate[] = [
	{
		id: "quadrant-priority",
		name: "Priority Matrix",
		category: "Quadrant Chart",
		description: "Eisenhower priority matrix",
		tags: ["priority", "matrix", "planning"],
		code: `quadrantChart
    title Task Priority Matrix
    x-axis Low Urgency --> High Urgency
    y-axis Low Important --> High Important
    quadrant-1 Do First
    quadrant-2 Schedule
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Fix Critical Bug: [0.9, 0.9]
    Plan Next Sprint: [0.3, 0.8]
    Team Meeting: [0.7, 0.3]
    Check Emails: [0.2, 0.2]
    Client Demo: [0.8, 0.85]`,
	},
];
