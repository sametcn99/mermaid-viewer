import { Box, IconButton } from "@mui/material";
import { RotateCcw } from "lucide-react";
import React from "react";

interface ResetViewButtonProps {
  onReset: () => void;
}

const ResetViewButton: React.FC<ResetViewButtonProps> = ({ onReset }) => (
  <Box
    sx={{
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 10,
    }}
  >
    <IconButton onClick={onReset} size="small" aria-label="Reset View">
      <RotateCcw />
    </IconButton>
  </Box>
);

export default ResetViewButton;
