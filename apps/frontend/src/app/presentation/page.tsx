import PresentationClient from "@/components/PresentationClient";
import type { Metadata } from "next";

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
	const rawSettings = params?.settings;
	const encodedSettings = Array.isArray(rawSettings)
		? rawSettings[0]
		: rawSettings;

	return (
		<PresentationClient
			encodedDiagram={encodedDiagram ?? undefined}
			encodedSettings={encodedSettings ?? undefined}
		/>
	);
}
