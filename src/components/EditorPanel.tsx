"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { CircularProgress, Box } from "@mui/material";

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
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language="markdown" // Using markdown as base, Mermaid syntax highlighting needs separate setup (advanced)
        theme={theme}
        value={initialValue}
        onChange={onChange}
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
