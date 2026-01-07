"use client";

import { Box, Card, CardContent, Typography, Alert } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { SocialLogin } from "@/components/Auth/SocialLogin";
import { Suspense } from "react";

function LoginForm() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

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

					{error && (
						<Alert severity="error" sx={{ width: "100%" }}>
							{error}
						</Alert>
					)}

					<SocialLogin />
				</CardContent>
			</Card>
		</Box>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<Box>Loading...</Box>}>
			<LoginForm />
		</Suspense>
	);
}
