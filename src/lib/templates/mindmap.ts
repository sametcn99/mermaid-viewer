import type { DiagramTemplate } from "./types";

export const mindmapTemplates: DiagramTemplate[] = [
	{
		id: "mindmap-basic",
		name: "Basic Mind Map",
		category: "Mindmap",
		description: "Simple concept organization",
		tags: ["brainstorm", "concept", "organization"],
		code: `mindmap
  root((Project Planning))
    Goals
      Increase Revenue
      Improve User Experience
      Reduce Costs
    Resources
      Team Members
      Budget
      Tools
    Timeline
      Q1 Planning
      Q2 Development
      Q3 Testing
      Q4 Launch`,
	},
	{
		id: "mindmap-learning",
		name: "Learning Path",
		category: "Mindmap",
		description: "Structured learning roadmap",
		tags: ["learning", "education", "roadmap"],
		code: `mindmap
  root((Full Stack Development))
    Frontend
      HTML/CSS
      JavaScript
        React
        Vue
        Angular
      Responsive Design
    Backend
      Node.js
      Python
        Django
        Flask
      APIs
        REST
        GraphQL
    Database
      SQL
        PostgreSQL
        MySQL
      NoSQL
        MongoDB
        Redis
    DevOps
      Git
      Docker
      CI/CD`,
	},
	{
		id: "mindmap-product-strategy",
		name: "Product Strategy",
		category: "Mindmap",
		description: "Strategic pillars for a product roadmap",
		tags: ["strategy", "product", "planning", "mindmap"],
		code: `mindmap
  root((Product Strategy 2025))
    Vision
      Unified Experience
      Global Reach
      Sustainable Growth
    Growth
      Freemium Model
      Partnerships
      Community Expansion
    Product
      Core Features
        Collaboration
        Automation
        Analytics
      Differentiators
        AI Assistant
        Integrations
        Templates
    Operations
      Hiring Plan
      Customer Success
      Incident Response
    Metrics
      NPS Target 60+
      ARR $25M
      Churn < 4%`,
	},
];
