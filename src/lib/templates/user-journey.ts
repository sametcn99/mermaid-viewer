import type { DiagramTemplate } from "./types";

export const userJourneyTemplates: DiagramTemplate[] = [
	{
		id: "journey-onboarding",
		name: "User Onboarding",
		category: "User Journey",
		description: "New user onboarding experience",
		tags: ["ux", "journey", "onboarding"],
		code: `journey
    title New User Onboarding Journey
    section Discovery
      Visit Website: 5: User
      Read Features: 4: User
      Watch Demo: 5: User
    section Sign Up
      Click Sign Up: 5: User
      Fill Form: 3: User
      Verify Email: 2: User
    section First Use
      Complete Tutorial: 4: User
      Create First Project: 5: User
      Invite Team Member: 3: User
    section Adoption
      Daily Usage: 5: User
      Explore Features: 4: User`,
	},
];
