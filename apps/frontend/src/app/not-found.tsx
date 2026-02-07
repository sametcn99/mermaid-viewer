"use client";

import Link from "next/link";
import { Box, Button, Typography, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				textAlign: "center",
			}}
		>
			<Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: "6rem", fontWeight: "bold", color: "text.secondary" }}>
				404
			</Typography>
			<Typography variant="h5" component="h2" gutterBottom>
				Page Not Found
			</Typography>
			<Typography color="text.secondary" paragraph>
				The page you are looking for does not exist or has been moved.
			</Typography>
			<Box mt={4}>
				<Button
					component={Link}
					href="/"
					variant="contained"
					startIcon={<HomeIcon />}
				>
					Back to Home
				</Button>
			</Box>
		</Container>
	);
}
