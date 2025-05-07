"use client";

import Editor from "@monaco-editor/react";
import { Box, CircularProgress } from "@mui/material";
import { updateUrlWithMermaidCode } from "../lib/url.utils";

interface EditorPanelProps {
  initialValue: string;
  onChange: (value: string | undefined) => void;
  theme?: "vs-dark" | "light";
}

export default function EditorPanel({
  initialValue,
  onChange,
  theme = "light",
}: EditorPanelProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value);

    if (value !== undefined) {
      const timeoutId = setTimeout(() => {
        updateUrlWithMermaidCode(value);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language="markdown"
        theme={theme}
        value={initialValue}
        onChange={handleEditorChange}
        loading={<CircularProgress />}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </Box>
  );
}
