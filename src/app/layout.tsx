import ThemeRegistry from "@/components/ThemeRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
