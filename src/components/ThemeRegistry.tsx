"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
