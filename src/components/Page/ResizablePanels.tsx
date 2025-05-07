import { Box } from "@mui/material";
import React, { RefObject } from "react";
import DiagramPanel from "../DiagramPanel/DiagramPanel";
import EditorPanel from "../EditorPanel/EditorPanel";

interface ResizablePanelsProps {
  editorPanelSize: number;
  containerRef: RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  isSmallScreen: boolean;
  mermaidCode: string;
  debouncedCode: string;
  handleEditorChange: (value: string) => void;
  isDarkMode: boolean;
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  editorPanelSize,
  containerRef,
  handleMouseDown,
  isSmallScreen,
  mermaidCode,
  debouncedCode,
  handleEditorChange,
  isDarkMode,
}) => (
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
      onTouchStart={handleMouseDown}
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
        height: isSmallScreen ? `${100 - editorPanelSize}%` : "100%",
        width: isSmallScreen ? "100%" : `${100 - editorPanelSize}%`,
        overflow: "hidden",
      }}
    >
      <DiagramPanel mermaidCode={debouncedCode} />
    </Box>
  </Box>
);

export default ResizablePanels;
