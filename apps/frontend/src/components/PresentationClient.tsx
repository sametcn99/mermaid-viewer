"use client";

import DiagramPanel from "@/components/DiagramPanel/DiagramPanel";
import LoadDiagramDialog from "@/components/LoadDiagramDialog";
import TemplateDialog from "@/components/TemplateDialog";
import { Box, Fab, Tooltip } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	compressToBase64,
	decompressFromBase64,
} from "@/lib/utils/compression.utils";
import { subscribeToUrlUpdates } from "@/lib/utils/url.utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	selectTemplateDiagram,
	setDebouncedCode,
	setHasUnsavedChanges,
	setMermaidCode,
} from "@/store/mermaidSlice";
import { selectSavedDiagrams } from "@/store/savedDiagramsSlice";
import { applyDiagramSettings } from "@/lib/diagram-settings";

interface PresentationClientProps {
	encodedDiagram?: string;
	encodedSettings?: string;
}

export default function PresentationClient({
	encodedDiagram,
	encodedSettings,
}: PresentationClientProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const mermaidCode = useAppSelector((state) => state.mermaid.mermaidCode);
	const currentDiagramId = useAppSelector(
		(state) => state.mermaid.currentDiagramId,
	);
	const savedDiagrams = useAppSelector(selectSavedDiagrams);
	const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
	const [queryString, setQueryString] = useState("");

	const currentDiagramName = useMemo(() => {
		if (!currentDiagramId) return undefined;
		return (
			savedDiagrams.find((diagram) => diagram.id === currentDiagramId)?.name ||
			undefined
		);
	}, [currentDiagramId, savedDiagrams]);

	useEffect(() => {
		if (!encodedDiagram) {
			return;
		}

		try {
			const decoded = decompressFromBase64(encodedDiagram);
			if (decoded !== mermaidCode) {
				dispatch(setMermaidCode(decoded));
				dispatch(setDebouncedCode(decoded));
				dispatch(setHasUnsavedChanges(false));
			}
		} catch (error) {
			console.error("Failed to decode presentation diagram", error);
			dispatch(setMermaidCode(""));
			dispatch(setDebouncedCode(""));
			dispatch(setHasUnsavedChanges(false));
		}
	}, [dispatch, encodedDiagram, mermaidCode]);

	useEffect(() => {
		const applySettings = async () => {
			if (!encodedSettings) {
				await applyDiagramSettings(null);
				return;
			}
			try {
				const decoded = decompressFromBase64(encodedSettings);
				const parsed = JSON.parse(decoded);
				await applyDiagramSettings(parsed);
			} catch (error) {
				console.error("Failed to decode presentation settings", error);
				await applyDiagramSettings(null);
			}
		};
		void applySettings();
	}, [encodedSettings]);

	const handleTemplateDialogOpen = useCallback(() => {
		setIsTemplateDialogOpen(true);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handler: EventListener = () => {
			handleTemplateDialogOpen();
		};
		window.addEventListener("openTemplateDialog", handler);
		return () => {
			window.removeEventListener("openTemplateDialog", handler);
		};
	}, [handleTemplateDialogOpen]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const update = () => {
			setQueryString(window.location.search);
		};
		update();
		const unsubscribe = subscribeToUrlUpdates(update);
		return () => {
			unsubscribe();
		};
	}, []);

	const handleTemplateDialogClose = useCallback(() => {
		setIsTemplateDialogOpen(false);
	}, []);

	const handleTemplateSelect = useCallback(
		(code: string, name: string) => {
			dispatch(selectTemplateDiagram({ code, name }));
			setIsTemplateDialogOpen(false);
		},
		[dispatch],
	);

	const backHref = useMemo(() => {
		if (queryString) {
			return `/${queryString}`;
		}
		let encodedFromCode: string | undefined;
		if (mermaidCode) {
			try {
				encodedFromCode = compressToBase64(mermaidCode);
			} catch (error) {
				console.error("Failed to encode presentation diagram", error);
			}
		}
		const encodedFallback = encodedDiagram ?? undefined;
		const encodedValue = encodedFromCode || encodedFallback;

		return encodedValue ? `/?diagram=${encodedValue}` : "/";
	}, [encodedDiagram, mermaidCode, queryString]);

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
			<DiagramPanel mermaidCode={mermaidCode} hideToolbar />

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

			<LoadDiagramDialog />

			<TemplateDialog
				open={isTemplateDialogOpen}
				onClose={handleTemplateDialogClose}
				onSelectTemplate={handleTemplateSelect}
				currentDiagramCode={mermaidCode}
				currentDiagramName={currentDiagramName}
			/>
		</Box>
	);
}
