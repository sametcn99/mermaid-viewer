"use client";

import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Koyu tema oluştur
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
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
