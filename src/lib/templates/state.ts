import type { DiagramTemplate } from "./types";

export const stateTemplates: DiagramTemplate[] = [
	{
		id: "state-basic",
		name: "Basic State Machine",
		category: "State",
		description: "Simple state transition diagram",
		tags: ["state", "fsm", "basic"],
		code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Failed: Error
    Success --> [*]
    Failed --> Idle: Retry
    Failed --> [*]: Cancel`,
	},
	{
		id: "state-order",
		name: "Order Processing States",
		category: "State",
		description: "E-commerce order state machine",
		tags: ["order", "workflow", "ecommerce"],
		code: `stateDiagram-v2
    [*] --> Pending
    Pending --> PaymentProcessing: Submit Payment
    PaymentProcessing --> Confirmed: Payment Success
    PaymentProcessing --> Cancelled: Payment Failed
    Confirmed --> Preparing: Start Preparation
    Preparing --> Shipped: Ship Order
    Shipped --> Delivered: Confirm Delivery
    Delivered --> [*]
    Cancelled --> [*]
    Confirmed --> Refunded: Request Refund
    Refunded --> [*]`,
	},
	{
		id: "state-user-session",
		name: "User Session States",
		category: "State",
		description: "User authentication session lifecycle",
		tags: ["auth", "session", "user"],
		code: `stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticating: Login Attempt
    Authenticating --> Authenticated: Success
    Authenticating --> Anonymous: Failed
    Authenticated --> Active: User Activity
    Active --> Idle: No Activity
    Idle --> Active: Resume Activity
    Idle --> Anonymous: Session Timeout
    Authenticated --> Anonymous: Logout
    Active --> Anonymous: Logout`,
	},
	{
		id: "state-release-pipeline",
		name: "Release Pipeline States",
		category: "State",
		description:
			"Continuous delivery release pipeline with approvals and rollback",
		tags: ["release", "pipeline", "devops", "deployment"],
		code: `stateDiagram-v2
    [*] --> BuildQueued
    BuildQueued --> Building: Worker Assigned
    Building --> BuildFailed: Tests Fail
    Building --> AwaitingApproval: Tests Pass
    BuildFailed --> BuildQueued: Retry

    state "Approval Gate" as Gate {
        AwaitingApproval --> Approved: Release Manager Approves
        AwaitingApproval --> Rejected: Changes Requested
        Rejected --> AwaitingApproval: Resubmit
    }

    Approved --> Deploying: Start Deployment
    Deploying --> Rollback: Health Check Failed
    Deploying --> Deployed: Health Check Passed
    Rollback --> BuildQueued: Create Hotfix Build
    Deployed --> Monitoring: Enable Observability
    Monitoring --> IncidentDetected: Alert Fired
    Monitoring --> [*]: Stable
    IncidentDetected --> Rollback`,
	},
];
