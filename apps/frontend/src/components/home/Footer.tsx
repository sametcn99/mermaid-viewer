"use client";

import {
	Box,
	Container,
	IconButton,
	Stack,
	Typography,
	Link as MuiLink,
} from "@mui/material";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				py: 6,
				borderTop: 1,
				borderColor: "divider",
				bgcolor: "background.default",
			}}
		>
			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", md: "row" }}
					justifyContent="space-between"
					alignItems="center"
					spacing={4}
				>
					<Box>
						<Typography variant="h6" fontWeight="bold">
							Mermaid Editor
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Open source diagramming tool for everyone.
						</Typography>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						© {currentYear}{" "}
						<MuiLink
							href="https://sametcc.me"
							target="_blank"
							underline="hover"
						>
							sametcc.me
						</MuiLink>
						<MuiLink href="/privacy" underline="hover" color="inherit">
							Privacy Policy
						</MuiLink>
						<MuiLink href="/terms" underline="hover" color="inherit">
							Terms of Service
						</MuiLink>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
