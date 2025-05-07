import { Box, IconButton } from "@mui/material";
import { Download, Share2 } from "lucide-react";
import React from "react";

interface DiagramToolbarProps {
  onShareUrl: () => void;
  onDownload: () => void;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
  onShareUrl,
  onDownload,
}) => (
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
    <IconButton onClick={onShareUrl} size="small" aria-label="Share URL">
      <Share2 />
    </IconButton>
    <IconButton onClick={onDownload} size="small" aria-label="Download SVG">
      <Download />
    </IconButton>
  </Box>
);

export default DiagramToolbar;
