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
	{
		id: "timeline-product-roadmap",
		name: "Product Roadmap",
		category: "Timeline",
		description: "Quarterly product roadmap milestones",
		tags: ["product", "roadmap", "planning", "timeline"],
		code: `timeline
    title Product Roadmap 2025
    Q1 2025 : Discovery Sprint : Validate AI assistant concept
    Feb 2025 : Alpha Release : Internal testing for AI assistant
    Q2 2025 : Beta Release : Limited customer rollout
    Jun 2025 : Metrics Review : Evaluate engagement and churn
    Q3 2025 : General Availability : Launch to all regions
    Sep 2025 : Mobile GA : Release mobile parity features
    Q4 2025 : Platform Summit : Showcase partner integrations`,
	},
	{
		id: "timeline-rebrand",
		name: "Rebranding Initiative",
		category: "Timeline",
		description: "Brand refresh campaign milestones",
		tags: ["marketing", "branding", "campaign", "timeline"],
		code: `timeline
    title Global Rebranding Initiative
    Jan 2025 : Kickoff Workshop : Define brand narrative
    Mar 2025 : Visual Identity : Finalize design system
    May 2025 : Website Launch : Deploy new marketing site
    Jul 2025 : Product Update : Refresh in-app UI
    Sep 2025 : Campaign Launch : Global announcement
    Nov 2025 : Post-launch Survey : Measure brand perception`,
	},
];
