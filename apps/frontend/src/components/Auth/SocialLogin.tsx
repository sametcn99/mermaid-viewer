"use client";

import { Box, Button } from "@mui/material";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import appConfig from "@/lib/config";
import { useAnalytics } from "@/hooks/useAnalytics";

export const SocialLogin = () => {
	const { track } = useAnalytics();

	const handleGoogleLogin = () => {
		track("login_google_click");
		// Use proxied API path so the browser hits nginx (no direct 3001 exposure)
		window.location.href = `/api/auth/google`;
	};

	const handleGithubLogin = () => {
		track("login_github_click");
		// Use proxied API path so the browser hits nginx (no direct 3001 exposure)
		window.location.href = `/api/auth/github`;
	};

	return (
		<Box sx={{ width: "100%", mt: 2 }}>
			{/* <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    OR
                </Typography>
            </Divider> */}
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Button
					variant="outlined"
					startIcon={<FontAwesomeIcon icon={faGoogle} />}
					onClick={handleGoogleLogin}
					fullWidth
					sx={{
						borderColor: "divider",
						color: "text.primary",
						"&:hover": {
							borderColor: "text.primary",
							backgroundColor: "action.hover",
						},
					}}
				>
					Continue with Google
				</Button>
				<Button
					variant="outlined"
					startIcon={<FontAwesomeIcon icon={faGithub} />}
					onClick={handleGithubLogin}
					fullWidth
					sx={{
						borderColor: "divider",
						color: "text.primary",
						"&:hover": {
							borderColor: "text.primary",
							backgroundColor: "action.hover",
						},
					}}
				>
					Continue with GitHub
				</Button>
			</Box>
		</Box>
	);
};
