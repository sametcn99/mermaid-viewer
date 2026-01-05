import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Mermaid Live Editor & Viewer",
		short_name: "Mermaid Editor",
		description:
			"Create, view, and edit Mermaid diagrams in real-time with this interactive online editor. Supports flowcharts, sequence diagrams, Gantt charts, and more.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#0a0a0a",
		orientation: "any",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
		categories: [
			"development",
			"productivity",
			"utilities",
			"education",
			"business",
		],
		lang: "en",
		dir: "ltr",
	};
}
