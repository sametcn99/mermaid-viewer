import type { Metadata } from "next";

const appMetadata: Metadata = {
	title: "Mermaid Live Editor & Viewer | Real-time Diagramming",
	description:
		"Create, view, and edit Mermaid diagrams in real-time with this interactive online editor. Supports flowcharts, sequence diagrams, Gantt charts, and more.",
	keywords: [
		"Mermaid",
		"diagram",
		"editor",
		"viewer",
		"live",
		"real-time",
		"flowchart",
		"sequence diagram",
		"Gantt chart",
		"UML",
		"markdown",
	],
	openGraph: {
		title: "Mermaid Live Editor & Viewer",
		description:
			"Interactive online tool for creating and viewing Mermaid diagrams.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Mermaid Live Editor & Viewer",
		description: "Create, view, and edit Mermaid diagrams in real-time.",
	},
};

export default appMetadata;
