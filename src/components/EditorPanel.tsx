"use client";

import Editor from "@monaco-editor/react";
import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { updateUrlWithMermaidCode } from "../lib/url.utils";

interface EditorPanelProps {
  initialValue: string;
  onChange: (value: string | undefined) => void;
  theme?: "vs-dark" | "light"; // Allow theme switching
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  initialValue,
  onChange,
  theme = "light",
}) => {
  // Update URL when content changes with a debounce
  const handleEditorChange = (value: string | undefined) => {
    onChange(value); // Pass the value up

    // Update URL with the new mermaid code (debounced)
    if (value !== undefined) {
      // Use a simple debounce to avoid updating URL on each keystroke
      const timeoutId = setTimeout(() => {
        updateUrlWithMermaidCode(value);
      }, 1000); // 1 second delay

      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language="markdown" // Using markdown as base, Mermaid syntax highlighting needs separate setup (advanced)
        theme={theme}
        value={initialValue}
        onChange={handleEditorChange}
        loading={<CircularProgress />}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true, // Important for responsive resizing
        }}
      />
    </Box>
  );
};

export default EditorPanel;
