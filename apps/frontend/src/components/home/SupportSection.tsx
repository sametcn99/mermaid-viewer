"use client";

import { Box, Container, Link, Typography } from "@mui/material";
import { Heart } from "lucide-react";

export default function SupportSection() {
	return (
		<Container maxWidth="lg" sx={{ textAlign: "center", py: 2 }}>
			<Link
				href="https://buymeacoffee.com/sametcn99"
				target="_blank"
				rel="noopener noreferrer"
				underline="none"
				sx={{
					whiteSpace: "nowrap",
					"&:hover": {
						textDecoration: "underline",
					},
					transition: "all 0.2s",
				}}
			>
				Buy me a coffee to help me ship faster and keep features free.
			</Link>
		</Container>
	);
}
