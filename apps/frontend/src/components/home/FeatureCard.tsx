"use client";
import type { ReactNode } from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	delay?: number;
}

export default function FeatureCard({
	icon,
	title,
	description,
	delay = 0,
}: FeatureCardProps) {
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				height: "100%",
				borderRadius: 4,
				background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
				border: "1px solid",
				borderColor: "divider",
				transition: "all 0.3s ease",
				position: "relative",
				overflow: "hidden",
				"&:hover": {
					boxShadow: theme.shadows[10],
					borderColor: theme.palette.primary.main,
					"& .icon-bg": {
						transform: "scale(1.3)",
						opacity: 0.08,
					},
				},
				animation: `fadeInUp 0.6s ease-out backwards ${delay}s`,
				"@keyframes fadeInUp": {
					"0%": { opacity: 0, transform: "translateY(20px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
			}}
		>
			<Box
				className="icon-bg"
				sx={{
					position: "absolute",
					top: -20,
					right: -20,
					opacity: 0.05,
					transition: "transform 0.4s ease, opacity 0.4s ease",
					"& svg": { width: 150, height: 150 },
				}}
			>
				{icon}
			</Box>

			<Box
				sx={{
					display: "inline-flex",
					p: 1.5,
					borderRadius: 2,
					bgcolor:
						theme.palette.mode === "dark"
							? "rgba(255,255,255,0.05)"
							: "rgba(0,0,0,0.05)",
					color: theme.palette.primary.main,
					mb: 3,
				}}
			>
				{icon}
			</Box>
			<Typography variant="h5" gutterBottom fontWeight=" boldly" sx={{ mb: 2 }}>
				{title}
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				sx={{ lineHeight: 1.7 }}
			>
				{description}
			</Typography>
		</Paper>
	);
}
