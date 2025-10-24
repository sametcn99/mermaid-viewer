"use client";

import DiagramPanel from "@/components/DiagramPanel/DiagramPanel";
import { getMermaidCodeFromEncoded, getMermaidCodeFromUrl } from "@/lib/url.utils";
import { encodeMermaid } from "@/lib/utils";
import { Box, Fab, Tooltip } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface PresentationClientProps {
	encodedDiagram?: string;
}

export default function PresentationClient({
	encodedDiagram,
}: PresentationClientProps) {
	const router = useRouter();
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		const decoded = getMermaidCodeFromEncoded(encodedDiagram);
		setCode(decoded);
	}, [encodedDiagram]);

	const backHref = useMemo(() => {
		if (encodedDiagram) {
			return `/?diagram=${encodeURIComponent(encodedDiagram)}`;
		}
		if (code) {
			return `/?diagram=${encodeURIComponent(encodeMermaid(code))}`;
		}
		return "/";
	}, [encodedDiagram, code]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				router.push(backHref);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [router, backHref]);

	return (
		<Box
			sx={{ height: "100vh", width: "100vw", bgcolor: "background.default" }}
		>
			<DiagramPanel mermaidCode={code} hideToolbar />

			<Tooltip title="Exit presentation (Esc)">
				<Fab
					color="default"
					size="medium"
					component={Link}
					href={backHref}
					aria-label="Exit presentation"
					sx={{
						position: "fixed",
						top: 16,
						left: 16,
						zIndex: (t) => t.zIndex.tooltip + 1,
					}}
					autoFocus
				>
					<ArrowLeft size={18} />
				</Fab>
			</Tooltip>
		</Box>
	);
}
