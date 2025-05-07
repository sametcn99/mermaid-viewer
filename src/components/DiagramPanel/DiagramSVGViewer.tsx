import { Box } from "@mui/material";
import React from "react";

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
      "& svg": {
        display: "block",
        maxWidth: "100%",
        height: "auto",
      },
    }}
  />
);

export default DiagramSVGViewer;
