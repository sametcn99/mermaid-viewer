"use client";

import { Box } from "@mui/material";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import CopyNotification from "./CopyNotification";
import DiagramEmpty from "./DiagramEmpty";
import DiagramError from "./DiagramError";
import DiagramLoading from "./DiagramLoading";
import DiagramSVGViewer from "./DiagramSVGViewer";
import DiagramToolbar from "./DiagramToolbar";
import ResetViewButton from "./ResetViewButton";

interface DiagramPanelProps {
	mermaidCode: string;
}

if (typeof window !== "undefined") {
	mermaid.initialize({
		startOnLoad: false,
		theme: "default",
	});
}

export default function DiagramPanel({ mermaidCode }: DiagramPanelProps) {
	const svgContainerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [svgContent, setSvgContent] = useState<string>("");
	const [showCopyNotification, setShowCopyNotification] = useState(false);

	useEffect(() => {
		const renderDiagram = async () => {
			if (!mermaidCode || typeof window === "undefined") {
				setSvgContent("");
				setError(null);
				return;
			}

			setIsLoading(true);
			setError(null);
			setSvgContent("");

			try {
				const uniqueId = `mermaid-diagram-${Date.now()}`;
				const { svg } = await mermaid.render(uniqueId, mermaidCode);
				setSvgContent(svg);
			} catch (err: unknown) {
				console.error("Mermaid rendering error:", err);
				if (err instanceof Error) {
					setError(err.message || "Failed to render Mermaid diagram.");
				} else {
					setError("An unknown error occurred during Mermaid rendering.");
				}
				setSvgContent("");
			} finally {
				setIsLoading(false);
			}
		};

		renderDiagram();
	}, [mermaidCode]);

	const handleDownload = () => {
		if (!svgContent || typeof window === "undefined") return;

		const blob = new Blob([svgContent], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "mermaid-diagram.svg";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleShareUrl = () => {
		if (typeof window === "undefined") return;

		const currentUrl = window.location.href;

		navigator.clipboard
			.writeText(currentUrl)
			.then(() => {
				setShowCopyNotification(true);
			})
			.catch((err) => {
				console.error("Failed to copy URL:", err);
			});
	};

	return (
		<Box
			sx={{
				height: "100%",
				width: "100%",
				overflow: "hidden",
				position: "relative",
				p: 1,
				bgcolor: "background.paper",
			}}
		>
			{svgContent && !isLoading && !error && (
				<DiagramToolbar
					onShareUrl={handleShareUrl}
					onDownload={handleDownload}
				/>
			)}

			{isLoading && <DiagramLoading />}
			{error && <DiagramError error={error} />}
			{!isLoading && !error && svgContent && (
				<TransformWrapper
					initialScale={1}
					centerOnInit={true}
					wheel={{ step: 0.5 }}
					pinch={{ step: 5 }}
					doubleClick={{ disabled: true }}
					limitToBounds={false}
					minScale={0.05}
					maxScale={50}
				>
					{({ resetTransform }) => (
						<>
							<ResetViewButton onReset={resetTransform} />
							<TransformComponent
								wrapperStyle={{ width: "100%", height: "100%" }}
								contentStyle={{
									width: "100%",
									height: "100%",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<DiagramSVGViewer
									svgContent={svgContent}
									svgContainerRef={svgContainerRef}
								/>
							</TransformComponent>
						</>
					)}
				</TransformWrapper>
			)}
			{!isLoading && !error && !svgContent && !mermaidCode && <DiagramEmpty />}

			<CopyNotification
				open={showCopyNotification}
				onClose={() => setShowCopyNotification(false)}
			/>
		</Box>
	);
}
