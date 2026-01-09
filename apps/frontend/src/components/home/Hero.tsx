"use client";

import {
	Box,
	Button,
	Container,
	Stack,
	Typography,
	useTheme,
	keyframes,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import GitHub from "@mui/icons-material/GitHub";

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Hero() {
	const theme = useTheme();

	const badges = [
		{ icon: <Zap size={14} />, text: "Real-time Preview" },
		{ icon: <Shield size={14} />, text: "Free & Open Source" },
		{ icon: <Sparkles size={14} />, text: "AI Powered" },
	];

	return (
		<Box
			sx={{
				pt: { xs: 12, md: 20 },
				pb: { xs: 8, md: 16 },
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Animated background gradient orbs */}
			<MotionBox
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
				sx={{
					position: "absolute",
					top: "-20%",
					left: "-10%",
					width: "50%",
					height: "50%",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
					filter: "blur(60px)",
					pointerEvents: "none",
				}}
			/>
			<MotionBox
				animate={{
					scale: [1.2, 1, 1.2],
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 10,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
				sx={{
					position: "absolute",
					top: "10%",
					right: "-10%",
					width: "40%",
					height: "40%",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${theme.palette.secondary.main}25 0%, transparent 70%)`,
					filter: "blur(60px)",
					pointerEvents: "none",
				}}
			/>

			{/* Floating particles */}
			{[...Array(15)].map((_, i) => (
				<MotionBox
					key={i}
					animate={{
						y: [0, -30, 0],
						x: [0, Math.sin(i) * 20, 0],
						opacity: [0.2, 0.5, 0.2],
					}}
					transition={{
						duration: 4 + Math.random() * 4,
						repeat: Number.POSITIVE_INFINITY,
						delay: Math.random() * 2,
						ease: "easeInOut",
					}}
					sx={{
						position: "absolute",
						width: 4 + Math.random() * 6,
						height: 4 + Math.random() * 6,
						borderRadius: "50%",
						bgcolor: theme.palette.primary.main,
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						pointerEvents: "none",
					}}
				/>
			))}

			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
				<Stack spacing={5} alignItems="center" textAlign="center">
					{/* Animated badges */}
					<MotionBox
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						sx={{
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						{badges.map((badge, index) => (
							<MotionBox
								key={badge.text}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
								whileHover={{ scale: 1.05, y: -2 }}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									py: 0.75,
									px: 2,
									borderRadius: "50px",
									bgcolor:
										theme.palette.mode === "dark"
											? "rgba(255,255,255,0.05)"
											: "rgba(0,0,0,0.03)",
									border: "1px solid",
									borderColor: "divider",
									backdropFilter: "blur(8px)",
									fontSize: "0.875rem",
									fontWeight: 500,
									color: "text.secondary",
								}}
							>
								<Box sx={{ color: "primary.main" }}>{badge.icon}</Box>
								{badge.text}
							</MotionBox>
						))}
					</MotionBox>

					{/* Main heading with staggered animation */}
					<Box sx={{ position: "relative" }}>
						<MotionTypography
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							variant="h1"
							sx={{
								fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem" },
								fontWeight: 800,
								lineHeight: 1.1,
								letterSpacing: "-0.03em",
								mb: 1,
							}}
						>
							Diagrams as Code
						</MotionTypography>
						<MotionBox
							initial={{ opacity: 0, y: 30, scale: 0.9 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<Typography
								variant="h1"
								sx={{
									fontSize: { xs: "2.75rem", sm: "4rem", md: "5.5rem" },
									fontWeight: 800,
									lineHeight: 1.1,
									letterSpacing: "-0.03em",
									background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, #ec4899, ${theme.palette.primary.main})`,
									backgroundSize: "300% auto",
									animation: `${gradientText} 6s ease infinite`,
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									position: "relative",
									display: "inline-block",
								}}
							>
								Made Simple
							</Typography>
						</MotionBox>
					</Box>

					{/* Subtitle */}
					<MotionTypography
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						variant="h5"
						color="text.secondary"
						sx={{
							maxWidth: "750px",
							lineHeight: 1.7,
							fontSize: { xs: "1.1rem", md: "1.35rem" },
							fontWeight: 400,
						}}
					>
						Create stunning flowcharts, sequence diagrams, and more with simple
						text syntax. Powered by Mermaid.js, enhanced with{" "}
						<Box
							component="span"
							sx={{ color: "primary.main", fontWeight: 600 }}
						>
							AI assistance
						</Box>
						, and instant live previews.
					</MotionTypography>

					{/* CTA Buttons */}
					<MotionBox
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 1 }}
					>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={2}
							sx={{ pt: 2 }}
						>
							<MotionBox
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									component={Link}
									href="/"
									variant="contained"
									size="large"
									sx={{
										px: 5,
										py: 2,
										fontSize: "1.1rem",
										borderRadius: "50px",
										textTransform: "none",
										fontWeight: 600,
										background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
										boxShadow: `0 10px 30px -10px ${theme.palette.primary.main}80`,
										position: "relative",
										overflow: "hidden",
										"&::before": {
											content: '""',
											position: "absolute",
											top: 0,
											left: "-100%",
											width: "100%",
											height: "100%",
											background:
												"linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
											transition: "left 0.5s ease",
										},
										"&:hover::before": {
											left: "100%",
										},
									}}
									endIcon={<ArrowRight />}
								>
									Start Creating Free
								</Button>
							</MotionBox>
							<MotionBox
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									component="a"
									href="https://github.com/sametcn99/mermaid-viewer"
									target="_blank"
									variant="outlined"
									size="large"
									sx={{
										px: 5,
										py: 2,
										fontSize: "1.1rem",
										borderRadius: "50px",
										textTransform: "none",
										fontWeight: 600,
										borderWidth: 2,
										borderColor: "divider",
										"&:hover": {
											borderWidth: 2,
											borderColor: "primary.main",
											bgcolor: "action.hover",
										},
									}}
									startIcon={<GitHub />}
								>
									GitHub
								</Button>
							</MotionBox>
						</Stack>
					</MotionBox>

					{/* Scroll indicator */}
					<MotionBox
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.5 }}
						sx={{ pt: 4 }}
					>
						<MotionBox
							animate={{ y: [0, 10, 0] }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
							sx={{
								width: 30,
								height: 50,
								borderRadius: 15,
								border: "2px solid",
								borderColor: "divider",
								display: "flex",
								justifyContent: "center",
								pt: 1,
							}}
						>
							<MotionBox
								animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
								transition={{
									duration: 2,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
								sx={{
									width: 4,
									height: 10,
									borderRadius: 2,
									bgcolor: "primary.main",
								}}
							/>
						</MotionBox>
					</MotionBox>
				</Stack>
			</Container>
		</Box>
	);
}
