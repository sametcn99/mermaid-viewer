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
	{
		id: "journey-support-ticket",
		name: "Support Ticket Resolution",
		category: "User Journey",
		description: "Customer support experience from issue report to resolution",
		tags: ["support", "journey", "experience", "service"],
		code: `journey
    title Support Ticket Resolution Journey
    section Report
      Submit Ticket: 2: Customer
      Auto Acknowledge: 3: System
      Assign Owner: 4: Support
    section Diagnose
      Initial Response: 3: Support
      Share Troubleshooting Steps: 4: Support
      Provide Logs: 1: Customer
    section Resolve
      Apply Fix: 4: Support
      Confirm Resolution: 3: Customer
      Close Ticket: 5: Support
    section Follow-up
      Send Survey: 3: System
      Provide Feedback: 4: Customer`,
	},
];
