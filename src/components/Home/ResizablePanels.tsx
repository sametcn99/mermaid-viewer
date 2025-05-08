import DiagramPanel from "@/components/DiagramPanel/DiagramPanel";
import EditorPanel from "@/components/EditorPanel/EditorPanel";
import useMermaidStore from "@/hooks/useMermaidStore";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

interface ResizablePanelsProps {
  mermaidCode: string;
  debouncedCode: string;
  handleEditorChange: (value: string) => void;
}

export default function ResizablePanels({
  mermaidCode,
  debouncedCode,
  handleEditorChange,
}: ResizablePanelsProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    panelSize,
    isPanelResizing,
    panelIsVertical,
    startPanelResize,
    stopPanelResize,
    updatePanelSizeWithConstraints,
    initializePanelSettings,
  } = useMermaidStore();

  useEffect(() => {
    initializePanelSettings({
      isVertical: isSmallScreen,
    });
  }, [isSmallScreen, initializePanelSettings]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isPanelResizing || !containerRef.current) return;

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      const rect = containerRef.current.getBoundingClientRect();
      let newSizePct;

      if (panelIsVertical) {
        const height = rect.height;
        if (height === 0) return;
        newSizePct = ((clientY - rect.top) / height) * 100;
      } else {
        const width = rect.width;
        if (width === 0) return;
        newSizePct = ((clientX - rect.left) / width) * 100;
      }
      updatePanelSizeWithConstraints(newSizePct);
    };

    const handleMouseUp = () => {
      stopPanelResize();
    };

    if (isPanelResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [
    isPanelResizing,
    panelIsVertical,
    stopPanelResize,
    updatePanelSizeWithConstraints,
    containerRef,
  ]);

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
          height: isSmallScreen ? `${panelSize}%` : "100%",
          width: isSmallScreen ? "100%" : `${panelSize}%`,
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
        onMouseDown={startPanelResize}
        onTouchStart={startPanelResize}
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
          height: isSmallScreen ? `${100 - panelSize}%` : "100%",
          width: isSmallScreen ? "100%" : `${100 - panelSize}%`,
          overflow: "hidden",
        }}
      >
        <DiagramPanel mermaidCode={debouncedCode} />
      </Box>
    </Box>
  );
}
