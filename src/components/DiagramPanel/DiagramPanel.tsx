"use client";

import { Box } from "@mui/material";
import mermaid, { type MermaidConfig } from "mermaid";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { getMermaidConfig, saveMermaidConfig } from "@/lib/storage.utils";
import CopyNotification from "./CopyNotification";
import DiagramEmpty from "./DiagramEmpty";
import DiagramError from "./DiagramError";
import DiagramLoading from "./DiagramLoading";
import DiagramSettings from "./DiagramSettings";
import DiagramSVGViewer from "./DiagramSVGViewer";
import DiagramToolbar from "./DiagramToolbar";
import ResetViewButton from "./ResetViewButton";

interface DiagramPanelProps {
	mermaidCode: string;
}

const defaultMermaidConfig: MermaidConfig = {
	startOnLoad: false,
	theme: "default",
};

if (typeof window !== "undefined") {
	mermaid.initialize(defaultMermaidConfig);
}

export default function DiagramPanel({ mermaidCode }: DiagramPanelProps) {
	const svgContainerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [svgContent, setSvgContent] = useState<string>("");
	const [showCopyNotification, setShowCopyNotification] = useState(false);
	const [mermaidConfig, setMermaidConfig] = useState<MermaidConfig>(() => {
		// localStorage'dan config yükle
		const savedConfig = getMermaidConfig();
		if (savedConfig && typeof savedConfig === "object") {
			return savedConfig as MermaidConfig;
		}
		return defaultMermaidConfig;
	});
	const [openSettings, setOpenSettings] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);

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
				// Apply current config before rendering
				mermaid.initialize(mermaidConfig);
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
	}, [mermaidCode, mermaidConfig]);

	// Config değiştiğinde localStorage'a kaydet
	useEffect(() => {
		saveMermaidConfig(mermaidConfig);
	}, [mermaidConfig]);

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

	const handleShareUrl = async () => {
		if (typeof window === "undefined") return;

		const currentUrl = window.location.href;

		// Check if Web Share API is supported
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Mermaid Diagram",
					text: "Check out this Mermaid diagram",
					url: currentUrl,
				});
			} catch (err) {
				// User cancelled the share or an error occurred
				if (err instanceof Error && err.name !== "AbortError") {
					// Fallback to copy if share fails (but not if user cancelled)
					fallbackToCopy(currentUrl);
				}
			}
		} else {
			// Fallback to copying URL if Web Share API is not supported
			fallbackToCopy(currentUrl);
		}
	};

	const fallbackToCopy = (url: string) => {
		navigator.clipboard
			.writeText(url)
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
					onOpenSettings={() => setOpenSettings(true)}
					zoomLevel={zoomLevel}
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
					onTransformed={(ref) => {
						setZoomLevel(ref.state.scale);
					}}
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

			<DiagramSettings
				open={openSettings}
				onClose={() => setOpenSettings(false)}
				currentConfig={mermaidConfig}
				onApply={(config) => {
					setMermaidConfig(config);
				}}
			/>
		</Box>
	);
}
