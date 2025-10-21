import ThemeRegistry from "@/components/ThemeRegistry";
import appMetadata, { appViewport } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
					data-website-id="f676397a-e4dd-4a55-92ca-d676057d269c"
				></script>
			</head>
			<body className={inter.className}>
				<ThemeRegistry>{children}</ThemeRegistry>
				<Analytics />
			</body>
		</html>
	);
}
