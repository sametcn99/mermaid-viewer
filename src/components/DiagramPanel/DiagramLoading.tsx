import { Box, CircularProgress } from "@mui/material";
import React from "react";

const DiagramLoading: React.FC = () => (
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
);

export default DiagramLoading;
