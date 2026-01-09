import type { DiagramTemplate } from "./types";

export const ganttTemplates: DiagramTemplate[] = [
	{
		id: "gantt-project",
		name: "Project Timeline",
		category: "Gantt",
		description: "Standard project management timeline",
		tags: ["project", "timeline", "planning"],
		code: `gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements Analysis    :a1, 2024-01-01, 7d
    Design Specification     :a2, after a1, 10d
    section Development
    Backend Development      :b1, after a2, 21d
    Frontend Development     :b2, after a2, 21d
    Integration             :b3, after b1, 7d
    section Testing
    Unit Testing            :c1, after b2, 5d
    Integration Testing     :c2, after b3, 7d
    UAT                     :c3, after c2, 5d
    section Deployment
    Production Deployment   :d1, after c3, 2d`,
	},
	{
		id: "gantt-sprint",
		name: "Sprint Planning",
		category: "Gantt",
		description: "Agile sprint schedule",
		tags: ["agile", "sprint", "scrum"],
		code: `gantt
    title Two-Week Sprint
    dateFormat YYYY-MM-DD
    section Sprint Planning
    Sprint Planning Meeting  :milestone, m1, 2024-01-01, 0d
    section Development
    User Story 1            :active, us1, 2024-01-01, 3d
    User Story 2            :us2, 2024-01-02, 4d
    User Story 3            :us3, 2024-01-04, 3d
    section Code Review
    Review & Refactoring    :cr1, after us1, 2d
    section Testing
    QA Testing              :qa1, after us2, 2d
    Bug Fixes               :bug1, after qa1, 2d
    section Deployment
    Sprint Review           :milestone, m2, after bug1, 0d
    Sprint Retrospective    :retro, after m2, 1d`,
	},
	{
		id: "gantt-product-launch",
		name: "Product Launch",
		category: "Gantt",
		description: "Complete product launch timeline with marketing",
		tags: ["product", "launch", "marketing", "release"],
		code: `gantt
    title Product Launch Timeline
    dateFormat YYYY-MM-DD
    section Product Development
    MVP Development         :dev1, 2024-01-01, 30d
    Beta Testing           :beta, after dev1, 14d
    Bug Fixes              :fixes, after beta, 7d
    Final Release          :milestone, release, after fixes, 0d
    section Marketing
    Market Research        :market, 2024-01-15, 21d
    Brand Development      :brand, after market, 14d
    Content Creation       :content, 2024-02-01, 28d
    Campaign Launch        :campaign, after brand, 21d
    section Operations
    Infrastructure Setup   :infra, 2024-01-20, 14d
    Support Training       :support, after infra, 7d
    Documentation         :docs, 2024-02-10, 14d
    Go-Live               :milestone, golive, after release, 0d`,
	},
	{
		id: "gantt-construction",
		name: "Construction Project",
		category: "Gantt",
		description: "Construction project timeline with dependencies",
		tags: ["construction", "building", "project", "phases"],
		code: `gantt
    title Office Building Construction
    dateFormat YYYY-MM-DD
    section Planning & Permits
    Site Survey            :survey, 2024-01-01, 7d
    Architectural Design   :design, after survey, 21d
    Permit Applications    :permits, after design, 14d
    Permit Approval        :milestone, approval, after permits, 0d
    section Foundation
    Site Preparation       :prep, after approval, 10d
    Foundation Excavation  :excavation, after prep, 7d
    Foundation Pour        :foundation, after excavation, 5d
    Foundation Curing      :curing, after foundation, 14d
    section Structure
    Steel Frame Erection   :steel, after curing, 21d
    Floor Installation     :floors, after steel, 14d
    Roof Installation      :roof, after floors, 10d
    section Finishing
    Electrical Work        :electrical, after roof, 21d
    Plumbing              :plumbing, after roof, 21d
    HVAC Installation     :hvac, after electrical, 14d
    Interior Finishing    :interior, after hvac, 28d
    Final Inspection      :milestone, final, after interior, 0d`,
	},
	{
		id: "gantt-event-planning",
		name: "Event Planning",
		category: "Gantt",
		description: "Conference event planning timeline",
		tags: ["event", "conference", "planning", "coordination"],
		code: `gantt
    title Annual Tech Conference
    dateFormat YYYY-MM-DD
    section Initial Planning
    Concept Development    :concept, 2024-01-01, 7d
    Budget Planning        :budget, after concept, 5d
    Venue Research         :venue, after budget, 14d
    Venue Booking          :milestone, booking, after venue, 0d
    section Content & Speakers
    Speaker Outreach       :speakers, 2024-01-15, 30d
    Agenda Planning        :agenda, after speakers, 14d
    Content Review         :review, after agenda, 7d
    section Marketing & Registration
    Website Development    :website, 2024-02-01, 21d
    Marketing Campaign     :marketing, after website, 45d
    Registration Opens     :milestone, regopen, after marketing, 0d
    section Logistics
    Catering Arrangements  :catering, 2024-03-01, 14d
    AV Equipment Setup     :av, 2024-03-10, 7d
    Staff Coordination     :staff, 2024-03-15, 10d
    Final Preparations     :final, after staff, 3d
    Event Day              :milestone, event, after final, 0d`,
	},
	{
		id: "gantt-research-and-development",
		name: "Research & Development Cycle",
		category: "Gantt",
		description: "Iterative R&D program with experimental sprints and reviews",
		tags: ["research", "development", "innovation", "rd"],
		code: `gantt
    title R&D Innovation Program
    dateFormat YYYY-MM-DD
    excludes weekends

    section Discovery
    Market Analysis         :disc1, 2024-04-01, 10d
    Technical Feasibility   :disc2, after disc1, 7d
    Hypothesis Definition   :disc3, after disc2, 5d

    section Experimentation
    Prototype Sprint 1      :exp1, after disc3, 14d
    Prototype Review 1      :milestone, rev1, after exp1, 0d
    Prototype Sprint 2      :exp2, after rev1, 14d
    Prototype Review 2      :milestone, rev2, after exp2, 0d

    section Validation
    User Testing Cohort A   :val1, after rev2, 7d
    User Testing Cohort B   :val2, 2024-05-20, 7d
    Data Analysis           :val3, after val1, 6d
    Engineering Assessment  :val4, after val3, 5d

    section Go/No-Go
    Executive Review        :milestone, exec, after val4, 0d
    Production Planning     :plan, after exec, 10d
    Knowledge Transfer      :kt, after plan, 5d`,
	},
];
