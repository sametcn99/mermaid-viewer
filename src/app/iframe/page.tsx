"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import {
	DEFAULT_IFRAME_OPTIONS,
	parseIframeOptions,
	type IframeOptionParseResult,
} from "@/lib/iframeOptions";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { decompressFromBase64 } from "@/lib/utils/compression.utils";

function getMermaidCodeFromSearchParams(): string {
	if (typeof window === "undefined") return "";
	if (!window.location.search) return "";
	const params = new URLSearchParams(window.location.search);
	const encoded = params.get("diagram");
	if (!encoded) return "";
	return decompressFromBase64(encoded);
}

export default function IframeMermaidPage() {
	const [{ options, warnings }] = useState<IframeOptionParseResult>(() => {
		if (typeof window === "undefined") {
			return { options: { ...DEFAULT_IFRAME_OPTIONS }, warnings: [] };
		}
		return parseIframeOptions(window.location.search);
	});
	const [svgContent, setSvgContent] = useState<string>("");
	const [isRendering, setIsRendering] = useState(false);
	const [renderError, setRenderError] = useState<string | null>(null);
	const resetTransformRef = useRef<(() => void) | null>(null);
	const centerViewRef = useRef<
		((scale?: number, animationTime?: number) => void) | null
	>(null);
	const diagramContainerRef = useRef<HTMLDivElement>(null);
	const { isTouchDevice, screen } = useSelector(
		(state: RootState) => state.device,
	);
	const isMobileTouch = isTouchDevice && screen.isMobile;

	useEffect(() => {
		if (warnings.length) {
			console.debug("[iframe] option warnings:", warnings);
		}
	}, [warnings]);

	useEffect(() => {
		let isMounted = true;
		const code = getMermaidCodeFromSearchParams();
		if (!code) {
			setRenderError("No Mermaid code found in URL.");
			setSvgContent("");
			return;
		}

		setIsRendering(true);
		setRenderError(null);
		setSvgContent("");
		mermaid.initialize({ startOnLoad: false });
		mermaid
			.render("mermaid-diagram", code)
			.then(({ svg }) => {
				if (!isMounted) return;
				setSvgContent(svg);
			})
			.catch((err) => {
				if (!isMounted) return;
				setRenderError(
					`Failed to render diagram: ${err instanceof Error ? err.message : "Unknown error"}`,
				);
				setSvgContent("");
			})
			.finally(() => {
				if (isMounted) {
					setIsRendering(false);
				}
			});

		return () => {
			isMounted = false;
			resetTransformRef.current = null;
			centerViewRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!svgContent) return;
		if (centerViewRef.current) {
			centerViewRef.current(options.initialZoom, 0);
		}
	}, [svgContent, options.initialZoom]);

	useEffect(() => {
		const container = diagramContainerRef.current;
		if (!container) return;

		container.innerHTML = "";
		if (svgContent) {
			container.innerHTML = svgContent;
		}

		return () => {
			container.innerHTML = "";
		};
	}, [svgContent]);

	const hasDiagram = Boolean(svgContent) && !isRendering && !renderError;
	const backgroundColor =
		options.background && options.background !== ""
			? options.background
			: undefined;

	return (
		<Box
			className="iframe-mermaid-root"
			tabIndex={0}
			sx={{
				width: "100%",
				height: "100%",
				boxSizing: "border-box",
				backgroundColor: backgroundColor ?? "background.paper",
				p: 2,
				outline: "none",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{renderError ? (
				<Alert severity="error">{renderError}</Alert>
			) : isRendering ? (
				<Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
					<CircularProgress />
				</Stack>
			) : hasDiagram ? (
				<TransformWrapper
					initialScale={options.initialZoom}
					minScale={options.minZoom}
					maxScale={options.maxZoom}
					wheel={{
						disabled: !options.enableZoom || isMobileTouch,
						step: isTouchDevice ? 0.3 : 0.5,
					}}
					pinch={{
						disabled: !options.enablePinch || !isTouchDevice,
						step: isTouchDevice ? 3 : 5,
					}}
					doubleClick={{
						disabled: !options.enableZoom,
						step: 1.5,
						mode: "zoomIn",
						animationTime: 200,
					}}
					panning={{
						disabled: !options.enablePan,
						velocityDisabled: !isTouchDevice,
					}}
					limitToBounds={false}
					disablePadding
					alignmentAnimation={{
						disabled: !isTouchDevice,
						sizeX: 0,
						sizeY: 0,
					}}
				>
					{({ resetTransform, centerView }) => {
						resetTransformRef.current = () => {
							if (options.initialZoom !== DEFAULT_IFRAME_OPTIONS.initialZoom) {
								centerView(options.initialZoom);
							} else {
								resetTransform();
							}
						};
						centerViewRef.current = centerView;

						return (
							<TransformComponent
								wrapperStyle={{
									width: "100%",
									height: "100%",
									touchAction: "none",
								}}
								contentStyle={{
									width: "100%",
									height: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Box
									ref={diagramContainerRef}
									sx={{
										width: "100%",
										height: "100%",
										pointerEvents: "none",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										"& svg": {
											maxWidth: "100%",
											maxHeight: "100%",
										},
									}}
								/>
							</TransformComponent>
						);
					}}
				</TransformWrapper>
			) : (
				<Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
					<Typography variant="body2" color="text.secondary">
						No diagram available.
					</Typography>
				</Stack>
			)}
		</Box>
	);
}
