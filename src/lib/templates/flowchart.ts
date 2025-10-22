import type { DiagramTemplate } from "./types";

export const flowchartTemplates: DiagramTemplate[] = [
	{
		id: "flowchart-basic",
		name: "Basic Flowchart",
		category: "Flowchart",
		description: "A simple flowchart with basic decision making",
		tags: ["basic", "decision", "simple"],
		code: `graph TD
    A[Start] --> B{Is it Friday?}
    B -->|Yes| C[Party!]
    B -->|No| D[Work]
    D --> E[Coffee Break]
    E --> D
    C --> F[Sleep]
    F --> G[End]`,
	},
	{
		id: "flowchart-decision-tree",
		name: "Decision Tree",
		category: "Flowchart",
		description: "Complex decision tree with multiple branches",
		tags: ["decision", "tree", "complex"],
		code: `graph TD
    A[Customer Request] --> B{Type of Request?}
    B -->|Bug Report| C[Create Bug Ticket]
    B -->|Feature Request| D[Evaluate Feasibility]
    B -->|Question| E[Check FAQ]
    C --> F[Assign to Developer]
    D --> G{Feasible?}
    G -->|Yes| H[Add to Backlog]
    G -->|No| I[Explain Limitation]
    E --> J{Found Answer?}
    J -->|Yes| K[Send Response]
    J -->|No| L[Escalate to Support]`,
	},
	{
		id: "flowchart-swimlane",
		name: "Swimlane Diagram",
		category: "Flowchart",
		description: "Process workflow with different actors",
		tags: ["swimlane", "process", "actors"],
		code: `graph TB
    subgraph Customer
        A[Place Order]
        F[Receive Product]
    end
    subgraph Sales
        B[Process Order]
        C[Send to Warehouse]
    end
    subgraph Warehouse
        D[Pick Items]
        E[Ship Product]
    end
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F`,
	},
	{
		id: "flowchart-process",
		name: "Process Workflow",
		category: "Flowchart",
		description: "Standard process workflow with loops",
		tags: ["process", "workflow", "loop"],
		code: `graph LR
    A[Start Project] --> B[Planning Phase]
    B --> C[Design]
    C --> D[Development]
    D --> E{Testing}
    E -->|Pass| F[Deployment]
    E -->|Fail| D
    F --> G{User Feedback}
    G -->|Issues Found| D
    G -->|Satisfied| H[Project Complete]`,
	},
	{
		id: "flowchart-user-registration",
		name: "User Registration Flow",
		category: "Flowchart",
		description: "Complete user registration process with validation",
		tags: ["user", "registration", "validation", "authentication"],
		code: `graph TD
    A[User Visits Registration Page] --> B[Fill Registration Form]
    B --> C{Valid Email Format?}
    C -->|No| D[Show Email Error]
    D --> B
    C -->|Yes| E{Password Strong Enough?}
    E -->|No| F[Show Password Requirements]
    F --> B
    E -->|Yes| G{Email Already Exists?}
    G -->|Yes| H[Show Email Exists Error]
    H --> B
    G -->|No| I[Send Verification Email]
    I --> J[Show Verification Message]
    J --> K[User Clicks Email Link]
    K --> L{Valid Token?}
    L -->|No| M[Show Invalid Link Error]
    L -->|Yes| N[Activate Account]
    N --> O[Redirect to Login]`,
	},
	{
		id: "flowchart-error-handling",
		name: "Error Handling Flow",
		category: "Flowchart",
		description: "Comprehensive error handling and recovery process",
		tags: ["error", "handling", "recovery", "fallback"],
		code: `graph TD
    A[Start Process] --> B[Execute Operation]
    B --> C{Operation Successful?}
    C -->|Yes| D[Return Success]
    C -->|No| E{Retryable Error?}
    E -->|Yes| F{Retry Count < Max?}
    F -->|Yes| G[Wait & Retry]
    G --> B
    F -->|No| H[Log Max Retries Exceeded]
    H --> I[Use Fallback Method]
    E -->|No| J[Log Critical Error]
    J --> K[Notify Administrator]
    K --> L[Return Error Response]
    I --> M{Fallback Successful?}
    M -->|Yes| N[Return Partial Success]
    M -->|No| O[Return System Error]`,
	},
	{
		id: "flowchart-data-processing",
		name: "Data Processing Pipeline",
		category: "Flowchart",
		description: "ETL data processing workflow with validation",
		tags: ["data", "etl", "processing", "validation"],
		code: `graph LR
    A[Raw Data Source] --> B[Extract Data]
    B --> C{Data Valid?}
    C -->|No| D[Log Validation Error]
    D --> E[Send to Dead Letter Queue]
    C -->|Yes| F[Transform Data]
    F --> G[Apply Business Rules]
    G --> H{Transformation OK?}
    H -->|No| I[Log Transform Error]
    I --> E
    H -->|Yes| J[Load to Staging]
    J --> K[Validate Staging Data]
    K --> L{Quality Check Pass?}
    L -->|No| M[Quarantine Data]
    L -->|Yes| N[Load to Production]
    N --> O[Update Audit Log]
    O --> P[Notify Success]`,
	},
	{
		id: "flowchart-deployment",
		name: "Deployment Process",
		category: "Flowchart",
		description: "Application deployment workflow with rollback",
		tags: ["deployment", "rollback", "production", "release"],
		code: `graph TD
    A[Start Deployment] --> B[Run Pre-deployment Tests]
    B --> C{Tests Pass?}
    C -->|No| D[Cancel Deployment]
    D --> E[Notify Failure]
    C -->|Yes| F[Backup Current Version]
    F --> G[Deploy New Version]
    G --> H[Run Health Checks]
    H --> I{Health Checks Pass?}
    I -->|No| J[Rollback to Previous Version]
    J --> K[Restore from Backup]
    K --> L[Run Post-rollback Tests]
    L --> M[Notify Rollback Complete]
    I -->|Yes| N[Run Smoke Tests]
    N --> O{Smoke Tests Pass?}
    O -->|No| J
    O -->|Yes| P[Update Load Balancer]
    P --> Q[Monitor for 10 Minutes]
    Q --> R{No Issues Detected?}
    R -->|No| J
    R -->|Yes| S[Mark Deployment Successful]
    S --> T[Clean Old Backups]
    T --> U[Notify Success]`,
	},
	{
		id: "flowchart-incident-response",
		name: "Incident Response Workflow",
		category: "Flowchart",
		description:
			"Operational incident response with escalation and recovery steps",
		tags: ["incident", "operations", "escalation", "recovery"],
		code: `graph TD
    A[Alert Triggered] --> B{Severity Level?}
    B -->|Critical| C[Page On-Call Engineer]
    B -->|High| D[Notify Primary Team]
    B -->|Medium| E[Create Incident Ticket]
    C --> F{Acknowledged?}
    F -->|No| G[Escalate to Secondary On-Call]
    F -->|Yes| H[Start Investigation]
    D --> H
    E --> H
    H --> I{Service Impacting?}
    I -->|Yes| J[Initiate Incident Bridge]
    I -->|No| K[Communicate Updates]
    H --> L[Run Diagnostics]
    L --> M{Root Cause Found?}
    M -->|No| N[Engage Subject Matter Expert]
    N --> L
    M -->|Yes| O[Implement Mitigation]
    O --> P{Mitigation Successful?}
    P -->|No| Q[Rollback Changes]
    P -->|Yes| R[Monitor Metrics]
    R --> S{Stable for 30 Minutes?}
    S -->|No| L
    S -->|Yes| T[Close Incident]
    T --> U[Publish Postmortem]`,
	},
];
