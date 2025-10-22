import type { DiagramTemplate } from "./types";

export const erDiagramTemplates: DiagramTemplate[] = [
	{
		id: "er-basic",
		name: "Basic Database Schema",
		category: "ER Diagram",
		description: "Simple entity relationship diagram",
		tags: ["database", "schema", "basic"],
		code: `erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id PK
        string username
        string email
        datetime created_at
    }
    ORDER {
        int id PK
        int user_id FK
        decimal total
        datetime order_date
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT {
        int id PK
        string name
        decimal price
        int stock
    }`,
	},
	{
		id: "er-ecommerce",
		name: "E-Commerce Database",
		category: "ER Diagram",
		description: "Complete e-commerce database schema",
		tags: ["ecommerce", "database", "complex"],
		code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ REVIEW : writes
    CUSTOMER {
        int customer_id PK
        string name
        string email
        string address
    }
    ORDER ||--|{ ORDER_LINE : contains
    ORDER {
        int order_id PK
        int customer_id FK
        datetime order_date
        string status
        decimal total_amount
    }
    ORDER_LINE }o--|| PRODUCT : references
    ORDER_LINE {
        int line_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    PRODUCT ||--o{ REVIEW : receives
    PRODUCT }o--|| CATEGORY : belongs_to
    PRODUCT {
        int product_id PK
        int category_id FK
        string name
        decimal price
        int stock_quantity
    }
    CATEGORY {
        int category_id PK
        string name
        string description
    }
    REVIEW {
        int review_id PK
        int product_id FK
        int customer_id FK
        int rating
        string comment
        datetime created_at
    }`,
	},
	{
		id: "er-saas",
		name: "SaaS Multi-Tenant Schema",
		category: "ER Diagram",
		description: "Software-as-a-service database with multi-tenant isolation",
		tags: ["database", "multi-tenant", "saas", "schema"],
		code: `erDiagram
    ACCOUNT ||--o{ WORKSPACE : owns
    WORKSPACE ||--o{ MEMBER : has
    WORKSPACE ||--o{ PROJECT : contains
    PROJECT ||--|{ TASK : includes
    MEMBER ||--o{ TASK : assigned_to
    MEMBER }|..|{ ROLE : uses
    PERMISSION ||--o{ ROLE : aggregates

    ACCOUNT {
        uuid account_id PK
        string company_name
        string billing_email
        string plan_tier
        datetime created_at
        datetime trial_ends_at
    }
    WORKSPACE {
        uuid workspace_id PK
        uuid account_id FK
        string name
        string subdomain
        string region
        datetime created_at
    }
    MEMBER {
        uuid member_id PK
        uuid workspace_id FK
        string email
        string status
        datetime invited_at
        datetime last_active_at
    }
    PROJECT {
        uuid project_id PK
        uuid workspace_id FK
        string name
        string status
        datetime start_date
        datetime end_date
    }
    TASK {
        uuid task_id PK
        uuid project_id FK
        uuid assignee_id FK
        string title
        string priority
        string state
        datetime due_date
    }
    ROLE {
        uuid role_id PK
        string name
        string scope
    }
    PERMISSION {
        uuid permission_id PK
        string resource
        string action
    }`,
	},
];
