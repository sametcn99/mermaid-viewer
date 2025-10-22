import ThemeRegistry from "@/components/ThemeRegistry";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import appMetadata, {
	APP_DESCRIPTION,
	APP_TITLE,
	OG_IMAGE_URL,
	SITE_URL_STRING,
	appViewport,
} from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const keywordContent = Array.isArray(appMetadata.keywords)
	? appMetadata.keywords.join(", ")
	: (appMetadata.keywords ?? "");

const structuredData = [
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: APP_TITLE,
		applicationCategory: "DeveloperApplication",
		description: APP_DESCRIPTION,
		keywords: keywordContent || undefined,
		operatingSystem: "Any",
		image: OG_IMAGE_URL,
		url: SITE_URL_STRING,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		author: {
			"@type": "Person",
			name: "sametcn99",
			url: "https://github.com/sametcn99",
		},
		publisher: {
			"@type": "Person",
			name: "sametcn99",
			url: "https://sametcc.me",
		},
		browserRequirements: "Requires JavaScript. Requires HTML5.",
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Mermaid Editor",
		url: SITE_URL_STRING,
		inLanguage: "en-US",
		description: APP_DESCRIPTION,
		sameAs: [
			"https://github.com/sametcn99/mermaid-viewer",
			"https://sametcc.me",
			SITE_URL_STRING,
		],
	},
];

const structuredDataScript = JSON.stringify(structuredData);

export const metadata: Metadata = {
	...appMetadata,
};

export const viewport: Viewport = {
	...appViewport,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					defer
					src="https://umami.sametcc.me/script.js"
					data-website-id="ec5d2947-854f-4175-b053-766a35fede0f"
				></script>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: .
					dangerouslySetInnerHTML={{ __html: structuredDataScript }}
				/>
			</head>
			<body className={inter.className}>
				<AppRouterCacheProvider options={{ key: "mui" }}>
					<ThemeRegistry>{children}</ThemeRegistry>
					<Analytics />
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
