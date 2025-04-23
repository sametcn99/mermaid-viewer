"use client";

import React, { useRef, useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import mermaid from "mermaid";
import { Box, CircularProgress, Alert } from "@mui/material";

interface DiagramPanelProps {
  mermaidCode: string;
}

// Initialize Mermaid (only once)
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false, // We'll render manually
    theme: "default", // Base theme, can be customized
    // securityLevel: 'loose', // Consider security implications if needed
  });
}

const DiagramPanel: React.FC<DiagramPanelProps> = ({ mermaidCode }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    const renderDiagram = async () => {
      if (!mermaidCode || typeof window === "undefined") {
        setSvgContent("");
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setSvgContent(""); // Clear previous diagram

      try {
        // Ensure mermaid is initialized (might be redundant but safe)
        // Use a unique ID for rendering to avoid conflicts if multiple diagrams exist
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
        setSvgContent(""); // Clear on error
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [mermaidCode]); // Re-render when code changes

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
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      {!isLoading && !error && svgContent && (
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={5}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: true }} // Optional: disable double click zoom
        >
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
            {/* Render the SVG content using sx prop */}
            <Box
              ref={svgContainerRef}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              sx={{
                width: "auto", // Let content determine width
                height: "auto", // Let content determine height
                maxWidth: "100%",
                maxHeight: "100%",
                "& svg": {
                  // Style the SVG element directly if needed
                  display: "block", // Prevent extra space below SVG
                  maxWidth: "100%",
                  height: "auto", // Maintain aspect ratio
                },
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      )}
      {!isLoading && !error && !svgContent && !mermaidCode && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "text.secondary",
          }}
        >
          Enter Mermaid code in the editor.
        </Box>
      )}
    </Box>
  );
};

export default DiagramPanel;
