import type { Metadata, Viewport } from "next";

const DEFAULT_SITE_URL = "https://mermaid.sametcc.me";
const OG_IMAGE_PATH = "/window.svg";

const ensureAbsoluteUrl = (value: string) =>
	value.startsWith("http://") || value.startsWith("https://")
		? value
		: `https://${value}`;

const resolveSiteUrl = () => {
	const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;

	if (envUrl) {
		try {
			return new URL(ensureAbsoluteUrl(envUrl));
		} catch {
			// Ignore invalid values coming from the runtime environment
		}
	}

	return new URL(DEFAULT_SITE_URL);
};

export const SITE_URL = resolveSiteUrl();
export const SITE_URL_STRING = SITE_URL.toString();
export const OG_IMAGE_URL = new URL(OG_IMAGE_PATH, SITE_URL).toString();

export const APP_DESCRIPTION =
	"Create, view, and edit Mermaid diagrams in real-time with this interactive online editor. Supports flowcharts, sequence diagrams, Gantt charts, class diagrams, state diagrams, entity relationship diagrams, user journey maps, and more. Free and open-source diagramming tool for developers and technical writers.";

export const APP_TITLE = "Mermaid Live Editor & Viewer | Real-time Diagramming";

const appMetadata: Metadata = {
	title: {
		default: APP_TITLE,
		template: "%s | Mermaid Editor",
	},
	description: APP_DESCRIPTION,
	metadataBase: SITE_URL,
	applicationName: "Mermaid Editor",
	category: "Development Tools",
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
		"diagram templates",
		"diagram generator",
	],
	authors: [
		{
			name: "sametcn99",
			url: "https://github.com/sametcn99",
		},
	],
	creator: "sametcn99",
	publisher: "sametcn99",
	formatDetection: {
		email: true,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
		languages: {
			"en-US": "/",
			"en-GB": "/",
		},
	},
	openGraph: {
		title: APP_TITLE,
		description: APP_DESCRIPTION,
		type: "website",
		locale: "en_US",
		siteName: "Mermaid Editor",
		url: SITE_URL_STRING,
		images: [
			{
				url: OG_IMAGE_URL,
				width: 1200,
				height: 630,
				alt: "Mermaid diagram editor showing synchronized code and rendered chart preview",
				type: "image/svg+xml",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: APP_TITLE,
		description: APP_DESCRIPTION,
		images: [OG_IMAGE_URL],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	manifest: "/manifest.json",
	icons: {
		icon: "/favicon.ico",
		apple: "/favicon.ico",
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
