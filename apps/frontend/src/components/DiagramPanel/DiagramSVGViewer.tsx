import { Box } from "@mui/material";
import type React from "react";

interface DiagramSVGViewerProps {
	svgContent: string;
	svgContainerRef:
		| React.RefObject<HTMLDivElement>
		| React.MutableRefObject<HTMLDivElement | null>;
}

const DiagramSVGViewer: React.FC<DiagramSVGViewerProps> = ({
	svgContent,
	svgContainerRef,
}) => (
	<Box
		ref={svgContainerRef}
		dangerouslySetInnerHTML={{ __html: svgContent }}
		sx={{
			width: "auto",
			height: "auto",
			maxWidth: "100%",
			maxHeight: "100%",
			// Touch optimization
			touchAction: "none", // Let react-zoom-pan-pinch handle all touch events
			userSelect: "none", // Prevent text selection
			"& svg": {
				display: "block",
				maxWidth: "100%",
				height: "auto",
				// Ensure SVG is touch-friendly
				touchAction: "none",
				userSelect: "none",
				pointerEvents: "none", // Prevent SVG from interfering with pan/zoom
			},
			// Mobile-specific optimizations
			"@media (max-width: 600px)": {
				minWidth: "100vw", // Ensure full width on small screens
				minHeight: "50vh", // Minimum height for better visibility
			},
		}}
	/>
);

export default DiagramSVGViewer;
