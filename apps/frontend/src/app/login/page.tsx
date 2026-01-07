"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { SocialLogin } from "@/components/Auth/SocialLogin";

export default function LoginPage() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "background.default",
			}}
		>
			<Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
				<CardContent
					sx={{ display: "flex", flexDirection: "column", gap: 2, p: 4 }}
				>
					<Typography variant="h5" component="h1" align="center" gutterBottom>
						Welcome Back
					</Typography>
					<Typography variant="body2" color="text.secondary" align="center">
						Sign in to access your diagrams and settings
					</Typography>

					<SocialLogin />
				</CardContent>
			</Card>
		</Box>
	);
}
