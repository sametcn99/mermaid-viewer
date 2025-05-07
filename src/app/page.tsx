"use client";

import React, { useState, useEffect, useMemo } from "react";
import Split from "react-split";
import EditorPanel from "@/components/EditorPanel";
import DiagramPanel from "@/components/DiagramPanel";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import debounce from "lodash.debounce";
import {
  getMermaidCodeFromUrl,
  updateUrlWithMermaidCode,
} from "@/lib/urlUtils";

const initialMermaidCode = `graph TD
  A[Start] --> B{Is it Friday?};
  B -- Yes --> C[Party!];
  B -- No --> D[Code];
  D --> E[Coffee];
  E --> D;
  C --> F[Sleep];
`;

export default function Home() {
  // Initialize with URL mermaid code or fallback to default
  const [mermaidCode, setMermaidCode] = useState<string>("");
  const [debouncedCode, setDebouncedCode] = useState<string>("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check for small screens (e.g., < 600px)

  // Load initial diagram from URL or use default
  useEffect(() => {
    const codeFromUrl = getMermaidCodeFromUrl();
    const initialCode = codeFromUrl || initialMermaidCode;
    setMermaidCode(initialCode);
    setDebouncedCode(initialCode);

    // If code was not in URL, set it now
    if (!codeFromUrl) {
      updateUrlWithMermaidCode(initialMermaidCode);
    }
  }, []);

  // Debounce the update to the diagram panel
  // Use useMemo to ensure the debounced function is stable
  const debouncedSetDiagramCode = useMemo(
    () =>
      debounce((code: string) => {
        setDebouncedCode(code);
      }, 300),
    [], // Empty dependency array means this is created once
  );

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setMermaidCode(newCode);
    debouncedSetDiagramCode(newCode);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetDiagramCode.cancel();
    };
  }, [debouncedSetDiagramCode]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Optional: Add a header/toolbar here */}
      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        <Split
          sizes={[50, 50]}
          minSize={isSmallScreen ? 0 : 100} // Allow collapsing on small screens
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction={isSmallScreen ? "vertical" : "horizontal"} // Stack vertically on small screens
          cursor={isSmallScreen ? "row-resize" : "col-resize"}
          style={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            height: "100%",
            width: "100%",
          }} // Ensure Split takes full height/width
        >
          {/* Editor Panel */}
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <EditorPanel
              initialValue={mermaidCode}
              onChange={handleEditorChange}
              theme={isDarkMode ? "vs-dark" : "light"}
            />
          </Box>

          {/* Diagram Panel */}
          <Box sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
            <DiagramPanel mermaidCode={debouncedCode} />
          </Box>
        </Split>
      </Box>
    </Box>
  );
}
