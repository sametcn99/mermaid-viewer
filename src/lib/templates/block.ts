import type { DiagramTemplate } from "./types";

export const blockTemplates: DiagramTemplate[] = [
	{
		id: "block-basic",
		name: "Basic Block Diagram",
		category: "Block",
		description: "Simple block diagram showing system components",
		tags: ["block", "basic", "components", "system"],
		code: `block-beta
  columns 3
  A["Input"] B["Process"] C["Output"]
  D["Feedback Loop"] E["Control"] F["Monitor"]
  
  A --> B
  B --> C
  C --> F
  F --> E
  E --> B
  B --> D
  D --> A`,
	},
	{
		id: "block-architecture",
		name: "System Architecture",
		category: "Block",
		description: "System architecture with layered components",
		tags: ["block", "architecture", "layers", "system"],
		code: `block-beta
  columns 4
  
  subgraph "Frontend Layer"
    A["Web App"]
    B["Mobile App"]
  end
  
  subgraph "API Layer"
    C["REST API"]
    D["GraphQL"]
  end
  
  subgraph "Business Layer"
    E["User Service"]
    F["Order Service"]
    G["Payment Service"]
  end
  
  subgraph "Data Layer"
    H[("User DB")]
    I[("Order DB")]
    J[("Payment DB")]
  end
  
  A --> C
  B --> C
  A --> D
  B --> D
  C --> E
  C --> F
  C --> G
  D --> E
  D --> F
  D --> G
  E --> H
  F --> I
  G --> J`,
	},
	{
		id: "block-network",
		name: "Network Diagram",
		category: "Block",
		description: "Network infrastructure block diagram",
		tags: ["block", "network", "infrastructure", "topology"],
		code: `block-beta
  columns 5
  
  Internet["Internet"]
  Router["Router"]
  Switch["Switch"]
  Server1["Web Server"]
  Server2["DB Server"]
  
  Firewall["Firewall"]
  LB["Load Balancer"]
  App1["App Server 1"]
  App2["App Server 2"]
  Storage[("Storage")]
  
  Internet --> Router
  Router --> Firewall
  Firewall --> LB
  LB --> App1
  LB --> App2
  Router --> Switch
  Switch --> Server1
  Switch --> Server2
  App1 --> Storage
  App2 --> Storage
  Server1 --> Server2`,
	},
];
