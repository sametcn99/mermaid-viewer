import type { DiagramTemplate } from "./types";

export const gitGraphTemplates: DiagramTemplate[] = [
	{
		id: "git-basic",
		name: "Basic Git Workflow",
		category: "Git Graph",
		description: "Simple git branching model",
		tags: ["git", "version", "workflow"],
		code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,
	},
	{
		id: "git-feature",
		name: "Feature Branch Workflow",
		category: "Git Graph",
		description: "Feature development branching strategy",
		tags: ["git", "feature", "branch"],
		code: `gitGraph
    commit id: "Initial commit"
    commit id: "Add base structure"
    branch develop
    checkout develop
    commit id: "Setup development"
    branch feature/login
    checkout feature/login
    commit id: "Add login UI"
    commit id: "Add authentication"
    checkout develop
    merge feature/login
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Create dashboard"
    commit id: "Add widgets"
    checkout develop
    merge feature/dashboard
    checkout main
    merge develop tag: "v1.0.0"`,
	},
];
