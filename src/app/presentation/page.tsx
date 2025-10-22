import type { Metadata } from "next";
import PresentationClient from "@/components/Presentation/PresentationClient";

export const metadata: Metadata = {
	title: "Presentation | Mermaid Editor",
	description: "Distraction-free presentation view for your Mermaid diagram.",
};

interface PageProps {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PresentationPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const raw = params?.diagram;
	const encodedDiagram = Array.isArray(raw) ? raw[0] : raw;

	return <PresentationClient encodedDiagram={encodedDiagram ?? undefined} />;
}
