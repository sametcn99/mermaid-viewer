import type { DiagramTemplate } from "./types";

export const timelineTemplates: DiagramTemplate[] = [
	{
		id: "timeline-company",
		name: "Company History",
		category: "Timeline",
		description: "Company milestone timeline",
		tags: ["history", "milestone", "timeline"],
		code: `timeline
    title Company Growth Timeline
    2018 : Company Founded : First Employee
    2019 : Series A Funding : Reached 10 Employees
    2020 : Product Launch : First 1000 Users
    2021 : Series B Funding : Expanded to 50 Employees
    2022 : International Expansion : 100K Users
    2023 : Profitability : 500K Users`,
	},
];
