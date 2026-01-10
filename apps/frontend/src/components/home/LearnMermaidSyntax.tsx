"use client";

import { Box, Container, Link, Paper, Typography } from "@mui/material";

export default function LearnMermaidSyntax() {
	return (
		<Container maxWidth="lg" sx={{ my: 4, textAlign: "center" }}>
			<Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
				📚 Learn Mermaid Syntax
			</Typography>
			<Typography variant="body1" color="text.secondary" paragraph>
				New to Mermaid? Check out the official documentation to learn about all
				diagram types and syntax:
			</Typography>
			<Link
				href="https://mermaid.js.org/intro/"
				target="_blank"
				rel="noopener noreferrer"
				underline="hover"
				sx={{
					display: "inline-flex",
					alignItems: "center",
					gap: 0.5,
					fontWeight: 600,
					fontSize: "1.1rem",
				}}
			>
				Official Mermaid Documentation →
			</Link>
		</Container>
	);
}
