"use client";

import DiagramPanel from "@/components/DiagramPanel/DiagramPanel";
import { Box, Fab, Tooltip } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	compressToBase64,
	decompressFromBase64,
} from "@/lib/utils/compression.utils";

interface PresentationClientProps {
	encodedDiagram?: string;
}

export default function PresentationClient({
	encodedDiagram,
}: PresentationClientProps) {
	const router = useRouter();
	const [code, setCode] = useState<string>("");

	useEffect(() => {
		if (!encodedDiagram) {
			return;
		}

		try {
			const decoded = decompressFromBase64(encodedDiagram);
			setCode(decoded);
		} catch (error) {
			console.error("Failed to decode presentation diagram", error);
			setCode("");
		}
	}, [encodedDiagram]);

	const backHref = useMemo(() => {
		let encodedFromCode: string | undefined;
		if (code) {
			try {
				encodedFromCode = compressToBase64(code);
			} catch (error) {
				console.error("Failed to encode presentation diagram", error);
			}
		}
		const encodedFallback = encodedDiagram ?? undefined;
		const encodedValue = encodedFromCode || encodedFallback;

		return encodedValue ? `/?diagram=${encodedValue}` : "/";
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
