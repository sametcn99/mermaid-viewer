import type { DiagramTemplate } from "./types";

export const sequenceTemplates: DiagramTemplate[] = [
	{
		id: "sequence-basic",
		name: "Basic Sequence",
		category: "Sequence",
		description: "Simple interaction between two entities",
		tags: ["basic", "interaction"],
		code: `sequenceDiagram
    participant User
    participant System
    User->>System: Request Data
    System->>System: Process Request
    System-->>User: Return Data
    User->>System: Confirm Receipt`,
	},
	{
		id: "sequence-api-flow",
		name: "API Request Flow",
		category: "Sequence",
		description: "Complete API request/response cycle",
		tags: ["api", "rest", "http"],
		code: `sequenceDiagram
    participant Client
    participant API Gateway
    participant Auth Service
    participant Database
    
    Client->>API Gateway: POST /api/login
    API Gateway->>Auth Service: Validate Credentials
    Auth Service->>Database: Query User
    Database-->>Auth Service: User Data
    Auth Service->>Auth Service: Generate JWT Token
    Auth Service-->>API Gateway: Token + User Info
    API Gateway-->>Client: 200 OK + Token`,
	},
	{
		id: "sequence-auth",
		name: "User Authentication",
		category: "Sequence",
		description: "OAuth authentication flow",
		tags: ["auth", "oauth", "login"],
		code: `sequenceDiagram
    participant User
    participant Client
    participant AuthServer
    participant ResourceServer
    
    User->>Client: Click Login
    Client->>AuthServer: Authorization Request
    AuthServer->>User: Login Page
    User->>AuthServer: Enter Credentials
    AuthServer->>AuthServer: Validate User
    AuthServer-->>Client: Authorization Code
    Client->>AuthServer: Exchange Code for Token
    AuthServer-->>Client: Access Token
    Client->>ResourceServer: Request Resource + Token
    ResourceServer->>ResourceServer: Validate Token
    ResourceServer-->>Client: Protected Resource
    Client-->>User: Display Resource`,
	},
	{
		id: "sequence-microservice",
		name: "Microservice Communication",
		category: "Sequence",
		description: "Inter-service communication pattern",
		tags: ["microservice", "distributed", "async"],
		code: `sequenceDiagram
    participant User Service
    participant Order Service
    participant Payment Service
    participant Notification Service
    
    User Service->>Order Service: Create Order
    Order Service->>Payment Service: Process Payment
    Payment Service-->>Order Service: Payment Confirmed
    Order Service->>Notification Service: Send Order Confirmation
    Notification Service-->>User Service: Email Sent
    Order Service-->>User Service: Order Created`,
	},
	{
		id: "sequence-database-transaction",
		name: "Database Transaction",
		category: "Sequence",
		description: "Database transaction with rollback handling",
		tags: ["database", "transaction", "rollback"],
		code: `sequenceDiagram
    participant App
    participant DB Controller
    participant Database
    participant Log Service
    
    App->>DB Controller: Begin Transaction
    DB Controller->>Database: START TRANSACTION
    Database-->>DB Controller: Transaction Started
    
    App->>DB Controller: Insert User
    DB Controller->>Database: INSERT INTO users
    Database-->>DB Controller: Insert Success
    
    App->>DB Controller: Insert Profile
    DB Controller->>Database: INSERT INTO profiles
    Database-->>DB Controller: Insert Failed
    
    DB Controller->>Database: ROLLBACK
    Database-->>DB Controller: Rollback Complete
    DB Controller->>Log Service: Log Error
    Log Service-->>DB Controller: Logged
    DB Controller-->>App: Transaction Failed`,
	},
	{
		id: "sequence-event-driven",
		name: "Event-Driven Architecture",
		category: "Sequence",
		description: "Event publishing and subscription pattern",
		tags: ["event", "publish", "subscribe", "async"],
		code: `sequenceDiagram
    participant Publisher
    participant Event Bus
    participant Subscriber A
    participant Subscriber B
    participant Dead Letter Queue
    
    Publisher->>Event Bus: Publish Event
    Event Bus->>Subscriber A: Deliver Event
    Event Bus->>Subscriber B: Deliver Event
    
    Subscriber A->>Subscriber A: Process Event
    Subscriber A-->>Event Bus: ACK
    
    Subscriber B->>Subscriber B: Process Event (Failed)
    Subscriber B-->>Event Bus: NACK
    Event Bus->>Event Bus: Retry Logic
    Event Bus->>Subscriber B: Redeliver Event
    Subscriber B-->>Event Bus: NACK (Max Retries)
    Event Bus->>Dead Letter Queue: Move to DLQ`,
	},
	{
		id: "sequence-ci-cd",
		name: "CI/CD Pipeline",
		category: "Sequence",
		description: "Continuous integration and deployment flow",
		tags: ["ci", "cd", "pipeline", "deployment"],
		code: `sequenceDiagram
    participant Developer
    participant Git Repo
    participant CI Server
    participant Test Environment
    participant Production
    
    Developer->>Git Repo: Push Code
    Git Repo->>CI Server: Trigger Build
    CI Server->>CI Server: Run Tests
    CI Server->>CI Server: Build Artifact
    CI Server->>Test Environment: Deploy to Test
    Test Environment-->>CI Server: Health Check OK
    CI Server->>CI Server: Run Integration Tests
    CI Server->>Production: Deploy to Production
    Production-->>CI Server: Deployment Success
    CI Server->>Developer: Notify Success`,
	},
	{
		id: "sequence-support-escalation",
		name: "Support Escalation Flow",
		category: "Sequence",
		description: "Customer support triage with chatbot handoff and escalation",
		tags: ["support", "escalation", "chatbot", "service"],
		code: `sequenceDiagram
    participant Customer
    participant Chatbot
    participant SupportAgent
    participant Specialist
    participant KnowledgeBase
    participant Ticketing

    Customer->>Chatbot: Initiate support request
    Chatbot->>KnowledgeBase: Search FAQ
    KnowledgeBase-->>Chatbot: Suggested solutions
    Chatbot-->>Customer: Provide top articles
    Customer->>Chatbot: Request human assistance
    Chatbot->>Ticketing: Open ticket
    Ticketing-->>SupportAgent: Assign new ticket
    SupportAgent->>Customer: Join conversation
    SupportAgent->>KnowledgeBase: Review history
    SupportAgent->>Customer: Ask clarifying questions
    Customer-->>SupportAgent: Provide details
    SupportAgent->>SupportAgent: Troubleshoot
    SupportAgent->>Customer: Offer resolution
    Customer-->>SupportAgent: Issue persists
    SupportAgent->>Specialist: Request escalation
    Specialist-->>SupportAgent: Accept escalation
    Specialist->>Customer: Join bridge call
    Specialist->>SupportAgent: Share resolution steps
    SupportAgent->>Ticketing: Update ticket with resolution
    Ticketing-->>Customer: Send summary email`,
	},
];
