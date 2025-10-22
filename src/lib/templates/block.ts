import type { DiagramTemplate } from "./types";

export const blockTemplates: DiagramTemplate[] = [
	{
		id: "block-basic",
		name: "Basic Block Diagram",
		category: "Block",
		description: "Simple block diagram showing system components",
		tags: ["block", "basic", "components", "system"],
		code: `block
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
		code: `block
  columns 4

  Frontend1["Web App"] Frontend2["Mobile App"]
  ApiRest["REST API"] ApiGraph["GraphQL"]
  ServiceUser["User Service"] ServiceOrder["Order Service"] ServicePayment["Payment Service"]
  DataUser[("User DB")] DataOrder[("Order DB")] DataPayment[("Payment DB")]

  Frontend1 --> ApiRest
  Frontend2 --> ApiRest
  Frontend1 --> ApiGraph
  Frontend2 --> ApiGraph

  ApiRest --> ServiceUser
  ApiRest --> ServiceOrder
  ApiRest --> ServicePayment
  ApiGraph --> ServiceUser
  ApiGraph --> ServiceOrder
  ApiGraph --> ServicePayment

  ServiceUser --> DataUser
  ServiceOrder --> DataOrder
  ServicePayment --> DataPayment`,
	},
	{
		id: "block-network",
		name: "Network Diagram",
		category: "Block",
		description: "Network infrastructure block diagram",
		tags: ["block", "network", "infrastructure", "topology"],
		code: `block
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
	{
		id: "block-data-pipeline",
		name: "Data Pipeline",
		category: "Block",
		description: "Streaming data pipeline from ingestion to analytics",
		tags: ["block", "data", "pipeline", "streaming"],
		code: `block
  columns 4

  Ingest["IoT Devices"] Buffer["Message Queue"] Stream["Stream Processor"] Storage[("Data Lake")]
  ETL["Batch ETL"] Warehouse[("Analytics Warehouse")] Dashboard["BI Dashboard"] Monitor["Monitoring"]

  Ingest --> Buffer
  Buffer --> Stream
  Stream --> Storage
  Storage --> ETL
  ETL --> Warehouse
  Warehouse --> Dashboard
  Stream --> Monitor
  Monitor --> Dashboard`,
	},
];
