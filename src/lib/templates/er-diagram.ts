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
];
