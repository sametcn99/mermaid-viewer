"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { initializeAuth } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";

export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const error = searchParams.get("error");

		if (error) {
			router.push(`/login?error=${encodeURIComponent(error)}`);
			return;
		}

		void dispatch(initializeAuth()).finally(() => {
			router.push("/");
		});
	}, [router, searchParams, dispatch]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
			}}
		>
			<CircularProgress />
			<Typography>Authenticating...</Typography>
		</Box>
	);
}
