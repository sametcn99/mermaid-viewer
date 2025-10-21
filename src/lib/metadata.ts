import type { Metadata, Viewport } from "next";

const appMetadata: Metadata = {
	title: "Mermaid Live Editor & Viewer | Real-time Diagramming",
	description:
		"Create, view, and edit Mermaid diagrams in real-time with this interactive online editor. Supports flowcharts, sequence diagrams, Gantt charts, class diagrams, state diagrams, entity relationship diagrams, user journey maps, and more. Free and open-source diagramming tool for developers and technical writers.",
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
		"class diagram",
		"state diagram",
		"ERD",
		"entity relationship diagram",
		"user journey",
		"pie chart",
		"git graph",
		"mindmap",
		"timeline",
		"online diagram tool",
		"free diagram editor",
		"developer tools",
		"documentation",
		"technical writing",
		"visualization",
		"open source",
	],
	authors: [
		{
			name: "sametcn99",
			url: "https://github.com/sametcn99",
		},
	],
	creator: "sametcn99",
	publisher: "sametcn99",
	applicationName: "Mermaid Viewer",
	category: "Development Tools",
	openGraph: {
		title: "Mermaid Live Editor & Viewer | Real-time Diagramming",
		description:
			"Interactive online tool for creating and viewing Mermaid diagrams. Supports multiple diagram types including flowcharts, sequence diagrams, Gantt charts, and more. Free and open-source.",
		type: "website",
		locale: "en_US",
		siteName: "Mermaid Viewer",
	},
	twitter: {
		card: "summary_large_image",
		title: "Mermaid Live Editor & Viewer | Real-time Diagramming",
		description:
			"Create, view, and edit Mermaid diagrams in real-time. Free online tool for developers and technical writers. Supports flowcharts, sequence diagrams, and more.",
	},
	manifest: "/manifest.json",
	icons: {
		icon: "/favicon.ico",
	},
};

export const appViewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
};

export default appMetadata;
