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
	{
		id: "git-release-hotfix",
		name: "Release and Hotfix Workflow",
		category: "Git Graph",
		description: "Release branch workflow with emergency hotfix handling",
		tags: ["git", "release", "hotfix", "workflow"],
		code: `gitGraph
    commit id: "Init"
    branch develop
    checkout develop
    commit id: "Feature groundwork"
    branch feature/search
    commit id: "Add search API"
    commit id: "Add search UI"
    checkout develop
    merge feature/search
    branch release/1.1.0
    commit id: "Prepare release notes"
    checkout main
    merge release/1.1.0 tag: "v1.1.0"
    branch hotfix/critical
    commit id: "Fix payment bug"
    checkout main
    merge hotfix/critical tag: "v1.1.1"
    checkout develop
    merge hotfix/critical
    checkout develop
    commit id: "Continue development"`,
	},
];
