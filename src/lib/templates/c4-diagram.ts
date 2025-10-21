import type { DiagramTemplate } from "./types";

export const c4DiagramTemplates: DiagramTemplate[] = [
	{
		id: "c4-context",
		name: "C4 System Context",
		category: "C4 Diagram",
		description:
			"High-level system context diagram showing system and external actors",
		tags: ["c4", "context", "system", "architecture"],
		code: `C4Context
    title System Context diagram for Online Banking System

    Person(customer, "Customer", "A customer of the bank")
    System(banking, "Online Banking System", "Allows customers to view account information and make payments")
    
    System_Ext(email, "E-mail System", "Internal Microsoft Exchange system")
    System_Ext(mainframe, "Mainframe Banking System", "Stores all the core banking information")

    Rel(customer, banking, "Uses")
    Rel_Back(customer, email, "Sends e-mails to")
    Rel(banking, email, "Sends e-mails using")
    Rel(banking, mainframe, "Gets account information from, and makes payments using")`,
	},
	{
		id: "c4-container",
		name: "C4 Container Diagram",
		category: "C4 Diagram",
		description:
			"Container-level architecture showing applications and data stores",
		tags: ["c4", "container", "application", "architecture"],
		code: `C4Container
    title Container diagram for Online Banking System

    Person(customer, "Customer", "A customer of the bank")

    Container_Boundary(c1, "Online Banking System") {
        Container(web_app, "Web Application", "Java and Spring MVC", "Delivers the static content and the Internet banking single page application")
        Container(spa, "Single-Page Application", "JavaScript and Angular", "Provides all the Internet banking functionality to customers via their web browser")
        Container(mobile_app, "Mobile App", "Xamarin", "Provides a limited subset of the Internet banking functionality to customers via their mobile device")
        Container(api_app, "API Application", "Java and Spring MVC", "Provides Internet banking functionality via a JSON/HTTPS API")
        ContainerDb(db, "Database", "Oracle Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
    }

    System_Ext(email, "E-mail System", "The internal Microsoft Exchange e-mail system")
    System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    Rel(customer, web_app, "Visits bigbank.com/ib using", "HTTPS")
    Rel(customer, spa, "Uses", "HTTPS")
    Rel(customer, mobile_app, "Uses")

    Rel(web_app, spa, "Delivers to the customer's web browser")
    
    Rel(spa, api_app, "Makes API calls to", "JSON/HTTPS")
    Rel(mobile_app, api_app, "Makes API calls to", "JSON/HTTPS")
    Rel_Back(db, api_app, "Reads from and writes to", "JDBC")

    Rel(api_app, email, "Sends e-mail using", "SMTP")
    Rel(api_app, mainframe, "Uses", "XML/HTTPS")`,
	},
	{
		id: "c4-component",
		name: "C4 Component Diagram",
		category: "C4 Diagram",
		description: "Component-level architecture showing internal structure",
		tags: ["c4", "component", "internal", "architecture"],
		code: `C4Component
    title Component diagram for Online Banking System - API Application

    Container(spa, "Single Page Application", "javascript and angular", "Provides all the internet banking functionality to customers via their web browser.")
    Container(ma, "Mobile App", "Xamarin", "Provides a limited subset of the internet banking functionality to customers via their mobile mobile device.")
    ContainerDb(db, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
    System_Ext(mbs, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")

    Container_Boundary(api, "API Application") {
        Component(sign, "Sign In Controller", "MVC Rest Controller", "Allows users to sign in to the internet banking system")
        Component(accounts, "Accounts Summary Controller", "MVC Rest Controller", "Provides customers with a summary of their bank accounts")
        Component(security, "Security Component", "Spring Bean", "Provides functionality related to signing in, changing passwords, etc.")
        Component(mbsfacade, "Mainframe Banking System Facade", "Spring Bean", "A facade onto the mainframe banking system.")

        Rel(sign, security, "Uses")
        Rel(accounts, mbsfacade, "Uses")
        Rel(security, db, "Read & write to", "JDBC")
        Rel(mbsfacade, mbs, "Uses", "XML/HTTPS")
    }

    Rel(spa, sign, "Makes API calls to", "JSON/HTTPS")
    Rel(spa, accounts, "Makes API calls to", "JSON/HTTPS")

    Rel(ma, sign, "Makes API calls to", "JSON/HTTPS")
    Rel(ma, accounts, "Makes API calls to", "JSON/HTTPS")`,
	},
];
