import DiagramPanel from "@/components/DiagramPanel/DiagramPanel";
import EditorPanel from "@/components/EditorPanel/EditorPanel";
import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
	clampPanelSize,
	initializePanel,
	resetPanel,
	setPanelResizing,
} from "@/store/resizablePanelsSlice";
import type { AiAssistantConfig } from "@/types/ai-assistant.types";

interface ResizablePanelsProps {
	isSmallScreen: boolean;
	mermaidCode: string;
	debouncedCode: string;
	handleEditorChange: (value: string) => void;
	isDarkMode: boolean;
	ai?: {
		config: AiAssistantConfig;
		onRequestConsent: () => void;
		onRequestFix: (errorMessage: string, code: string) => Promise<void>;
	};
	instanceId?: string;
}

const DEFAULT_PANEL_SIZE = 50;

export default function ResizablePanels({
	isSmallScreen,
	mermaidCode,
	debouncedCode,
	handleEditorChange,
	isDarkMode,
	ai,
	instanceId = "home-panels",
}: ResizablePanelsProps) {
	const dispatch = useDispatch<AppDispatch>();
	const containerRef = useRef<HTMLDivElement>(null);
	const panelState = useSelector(
		(state: RootState) => state.resizablePanels.instances[instanceId],
	);
	const panelSize = panelState?.panelSize ?? DEFAULT_PANEL_SIZE;
	const isResizing = panelState?.isResizing ?? false;

	const minSize = useMemo(() => (isSmallScreen ? 0 : 10), [isSmallScreen]);
	const maxSize = useMemo(() => (isSmallScreen ? 100 : 90), [isSmallScreen]);
	const isVertical = isSmallScreen;
	const orientationRef = useRef(isSmallScreen);

	useEffect(() => {
		dispatch(
			initializePanel({ id: instanceId, panelSize: DEFAULT_PANEL_SIZE }),
		);
		return () => {
			dispatch(resetPanel({ id: instanceId }));
		};
	}, [dispatch, instanceId]);

	useEffect(() => {
		if (orientationRef.current === isSmallScreen) return;
		orientationRef.current = isSmallScreen;
		dispatch(
			clampPanelSize({
				id: instanceId,
				value: panelSize,
				minSize,
				maxSize,
				isVertical,
			}),
		);
	}, [
		dispatch,
		instanceId,
		isSmallScreen,
		panelSize,
		minSize,
		maxSize,
		isVertical,
	]);

	const handlePointerMove = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!isResizing || !containerRef.current) return;
			const bounds = containerRef.current.getBoundingClientRect();
			if (bounds.width === 0 || bounds.height === 0) return;

			let newSizePct: number;
			if (isVertical) {
				const clientY =
					"touches" in event ? event.touches[0]?.clientY : event.clientY;
				if (clientY === undefined) return;
				newSizePct = ((clientY - bounds.top) / bounds.height) * 100;
			} else {
				const clientX =
					"touches" in event ? event.touches[0]?.clientX : event.clientX;
				if (clientX === undefined) return;
				newSizePct = ((clientX - bounds.left) / bounds.width) * 100;
			}

			dispatch(
				clampPanelSize({
					id: instanceId,
					value: newSizePct,
					minSize,
					maxSize,
					isVertical,
				}),
			);
		},
		[dispatch, instanceId, isResizing, isVertical, minSize, maxSize],
	);

	const handleMouseDown = useCallback(() => {
		dispatch(setPanelResizing({ id: instanceId, isResizing: true }));
	}, [dispatch, instanceId]);

	const handleMouseUp = useCallback(() => {
		dispatch(setPanelResizing({ id: instanceId, isResizing: false }));
	}, [dispatch, instanceId]);

	useEffect(() => {
		if (!isResizing) return;

		const handleMouseMove = (event: MouseEvent) => handlePointerMove(event);
		const handleTouchMove = (event: TouchEvent) => handlePointerMove(event);

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleMouseUp);
		};
	}, [handleMouseUp, handlePointerMove, isResizing]);

	const editorPanelSize = panelSize;
	const viewerPanelSize = 100 - editorPanelSize;

	return (
		<Box
			ref={containerRef}
			sx={{
				flexGrow: 1,
				display: "flex",
				overflow: "hidden",
				flexDirection: isSmallScreen ? "column" : "row",
				height: "calc(100vh - 64px)",
				width: "100%",
			}}
		>
			<Box
				sx={{
					height: isSmallScreen ? `${editorPanelSize}%` : "100%",
					width: isSmallScreen ? "100%" : `${editorPanelSize}%`,
					overflow: "hidden",
					position: "relative",
				}}
			>
				<EditorPanel
					initialValue={mermaidCode}
					onChange={(value: string | undefined) =>
						handleEditorChange(value ?? "")
					}
					theme={isDarkMode ? "vs-dark" : "light"}
				/>
			</Box>
			<Box
				onMouseDown={handleMouseDown}
				onTouchStart={(event) => {
					handleMouseDown();
					handlePointerMove(event.nativeEvent);
				}}
				sx={{
					width: isSmallScreen ? "100%" : "10px",
					height: isSmallScreen ? "10px" : "100%",
					cursor: isSmallScreen ? "row-resize" : "col-resize",
					backgroundColor: (theme) => theme.palette.divider,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					"&:hover": {
						backgroundColor: (theme) => theme.palette.action.hover,
					},
				}}
			>
				<Box
					sx={{
						width: isSmallScreen ? "30px" : "2px",
						height: isSmallScreen ? "2px" : "30px",
						backgroundColor: (theme) => theme.palette.text.disabled,
						borderRadius: "1px",
					}}
				/>
			</Box>
			<Box
				sx={{
					height: isSmallScreen ? `${viewerPanelSize}%` : "100%",
					width: isSmallScreen ? "100%" : `${viewerPanelSize}%`,
					overflow: "hidden",
				}}
			>
				<DiagramPanel mermaidCode={debouncedCode} ai={ai} />
			</Box>
		</Box>
	);
}
