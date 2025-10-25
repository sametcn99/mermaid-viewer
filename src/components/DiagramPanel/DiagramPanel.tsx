"use client";

import { Box } from "@mui/material";
import mermaid, { type MermaidConfig } from "mermaid";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
	getMermaidConfig,
	saveMermaidConfig,
} from "@/lib/indexed-db/mermaid-config.storage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import CopyNotification from "./CopyNotification";
import DiagramEmpty from "./DiagramEmpty";
import DiagramError from "./DiagramError";
import DiagramLoading from "./DiagramLoading";
import DiagramSettings from "./DiagramSettings";
import DiagramSVGViewer from "./DiagramSVGViewer";
import DiagramToolbar from "./DiagramToolbar";
import type { AiAssistantConfig } from "@/types/ai-assistant.types";

interface DiagramPanelProps {
	mermaidCode: string;
	hideToolbar?: boolean;
	ai?: {
		config: AiAssistantConfig;
		onRequestConsent: () => void;
		onRequestFix: (errorMessage: string, code: string) => Promise<void>;
	};
}

const defaultMermaidConfig: MermaidConfig = {
	startOnLoad: false,
	theme: "default",
};

if (typeof window !== "undefined") {
	mermaid.initialize(defaultMermaidConfig);
}

export default function DiagramPanel({
	mermaidCode,
	hideToolbar,
	ai,
}: DiagramPanelProps) {
	const svgContainerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [svgContent, setSvgContent] = useState<string>("");
	const [showCopyNotification, setShowCopyNotification] = useState(false);
	const [mermaidConfig, setMermaidConfig] =
		useState<MermaidConfig>(defaultMermaidConfig);
	const [openSettings, setOpenSettings] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [aiConfig, setAiConfig] = useState(ai?.config);
	const resetTransformRef = useRef<(() => void) | null>(null);

	const { isTouchDevice, screen } = useSelector(
		(state: RootState) => state.device,
	);
	const isMobileTouch = isTouchDevice && screen.isMobile;

	// Load saved config on mount
	useEffect(() => {
		const loadConfig = async () => {
			const savedConfig = await getMermaidConfig();
			if (savedConfig && typeof savedConfig === "object") {
				setMermaidConfig(savedConfig as MermaidConfig);
			}
		};
		loadConfig();
	}, []);

	// Listen for AI config changes
	useEffect(() => {
		setAiConfig(ai?.config);
	}, [ai?.config]);

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
			{svgContent && !isLoading && !error && !hideToolbar && (
				<DiagramToolbar
					onShareUrl={handleShareUrl}
					onDownload={handleDownload}
					onOpenSettings={() => setOpenSettings(true)}
					onResetView={() => resetTransformRef.current?.()}
					zoomLevel={zoomLevel}
				/>
			)}

			{isLoading && <DiagramLoading />}
			{error && (
				<DiagramError
					error={error}
					currentCode={mermaidCode}
					onRequestFix={ai?.onRequestFix}
					ai={
						ai
							? {
									consentGiven:
										aiConfig?.consentGiven || ai.config.consentGiven,
									onRequestConsent: ai.onRequestConsent,
								}
							: undefined
					}
				/>
			)}
			{!isLoading && !error && svgContent && (
				<TransformWrapper
					initialScale={1}
					centerOnInit={true}
					wheel={{
						step: isTouchDevice ? 0.3 : 0.5, // Smaller steps for touch devices
						wheelDisabled: isMobileTouch, // Disable wheel on mobile touch
					}}
					pinch={{
						step: isTouchDevice ? 3 : 5,
						disabled: !isTouchDevice, // Only enable pinch on touch devices
					}}
					panning={{
						disabled: false,
						activationKeys: [], // Allow panning without modifier keys
						velocityDisabled: !isTouchDevice, // Enable momentum only on touch
						lockAxisX: false,
						lockAxisY: false,
					}}
					doubleClick={{
						disabled: !isTouchDevice, // Enable double-tap only on touch devices
						step: 1.5, // Better zoom step for double tap
						mode: "zoomIn",
						animationTime: 200,
					}}
					limitToBounds={false}
					minScale={isMobileTouch ? 0.2 : 0.1} // Higher minimum for mobile
					maxScale={isMobileTouch ? 5 : 10} // Lower maximum for mobile performance
					onTransformed={(ref) => {
						setZoomLevel(ref.state.scale);
					}}
					// Mobile optimizations
					disablePadding={true}
					alignmentAnimation={{
						disabled: !isTouchDevice,
						sizeX: 0,
						sizeY: 0,
					}}
				>
					{({ resetTransform: resetFn }) => {
						// Store the reset function for toolbar use
						resetTransformRef.current = resetFn;

						return (
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
						);
					}}
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
