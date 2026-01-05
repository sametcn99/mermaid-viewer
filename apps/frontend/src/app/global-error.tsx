"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Box, Button, Stack, Typography } from "@mui/material";
import ThemeRegistry from "@/components/ThemeRegistry";
import StoreProvider from "@/store/StoreProvider";
import DeviceStateInitializer from "@/components/DeviceStateInitializer";

type GlobalErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error("Global application error:", error);
	}, [error]);

	return (
		<html lang="en">
			<body className={inter.className}>
				<AppRouterCacheProvider options={{ key: "mui" }}>
					<ThemeRegistry>
						<StoreProvider>
							<DeviceStateInitializer />
							<Box
								component="main"
								sx={{
									minHeight: "100vh",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									px: 3,
								}}
							>
								<Stack spacing={3} alignItems="center" textAlign="center">
									<Typography variant="h3" component="h1">
										Something went wrong
									</Typography>
									<Typography variant="body1" color="text.secondary">
										The application hit an unexpected issue. You can try again
										or reload the page.
									</Typography>
									<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
										<Button variant="contained" onClick={reset}>
											Try again
										</Button>
										<Button
											variant="outlined"
											onClick={() => window.location.reload()}
										>
											Reload page
										</Button>
									</Stack>
									{error.digest ? (
										<Typography variant="body2" color="text.disabled">
											Error reference: {error.digest}
										</Typography>
									) : null}
								</Stack>
							</Box>
						</StoreProvider>
					</ThemeRegistry>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
