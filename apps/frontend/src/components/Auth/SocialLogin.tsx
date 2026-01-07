"use client";

import { Box, Button, Divider, Typography } from "@mui/material";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const SocialLogin = () => {
	const handleGoogleLogin = () => {
		window.location.href = "http://localhost:3001/auth/google"; // Backend URL
	};

	const handleGithubLogin = () => {
		window.location.href = "http://localhost:3001/auth/github"; // Backend URL
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
