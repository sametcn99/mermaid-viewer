"use client";

import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Download, RotateCcw, Share2 } from "lucide-react";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

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
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 10,
            display: "flex",
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleShareUrl}
            size="small"
            aria-label="Share URL"
          >
            <Share2 />
          </IconButton>
          <IconButton
            onClick={handleDownload}
            size="small"
            aria-label="Download SVG"
          >
            <Download />
          </IconButton>
        </Box>
      )}

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
              <Box
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  zIndex: 10,
                }}
              >
                <IconButton
                  onClick={() => resetTransform()}
                  size="small"
                  aria-label="Reset View"
                >
                  <RotateCcw />
                </IconButton>
              </Box>

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
              </TransformComponent>
            </>
          )}
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

      <Snackbar
        open={showCopyNotification}
        autoHideDuration={3000}
        onClose={() => setShowCopyNotification(false)}
        message="URL copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
