"use client";

import { defaultTheme } from "@/lib/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type React from "react";

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
