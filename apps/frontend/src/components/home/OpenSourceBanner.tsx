"use client";

import { Box, Container, Typography, useTheme, Link } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GitHub from "@mui/icons-material/GitHub";
import { Star, GitFork, Eye, ExternalLink } from "lucide-react";

const MotionBox = motion.create(Box);

export default function OpenSourceBanner() {
	const theme = useTheme();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<Box
			ref={ref}
			sx={{
				py: { xs: 8, md: 12 },
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Container maxWidth="lg">
				<MotionBox
					initial={{ opacity: 0, y: 40 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					sx={{
						p: { xs: 4, md: 8 },
						borderRadius: 6,
						position: "relative",
						overflow: "hidden",
						background:
							theme.palette.mode === "dark"
								? "linear-gradient(135deg, rgba(13, 17, 23, 0.3) 0%, rgba(22, 27, 34, 0.3) 100%)"
								: "linear-gradient(135deg, rgba(36, 41, 47, 0.3) 0%, rgba(28, 33, 40, 0.3) 100%)",
						boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
					}}
				>
					{/* Animated background grid */}
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundImage: `
								linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
								linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
							`,
							backgroundSize: "50px 50px",
							pointerEvents: "none",
						}}
					/>

					{/* Floating GitHub icons */}
					{[...Array(6)].map((_, i) => (
						<MotionBox
							key={i}
							initial={{ opacity: 0.05 }}
							animate={{
								y: [0, -20, 0],
								rotate: [-5, 5, -5],
								opacity: [0.05, 0.1, 0.05],
							}}
							transition={{
								duration: 4 + i,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.5,
							}}
							sx={{
								position: "absolute",
								color: "white",
								opacity: 0.05,
								left: `${15 + i * 15}%`,
								top: `${20 + (i % 3) * 25}%`,
								pointerEvents: "none",
							}}
						>
							<GitHub sx={{ fontSize: 40 + i * 10 }} />
						</MotionBox>
					))}

					<Box
						sx={{
							position: "relative",
							zIndex: 1,
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							alignItems: "center",
							justifyContent: "space-between",
							gap: 4,
						}}
					>
						<Box sx={{ flex: 1 }}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
									mb: 3,
								}}
							>
								<Box
									sx={{
										width: 56,
										height: 56,
										borderRadius: "50%",
										bgcolor: "rgba(255,255,255,0.1)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<GitHub sx={{ fontSize: 32, color: "white" }} />
								</Box>
								<Typography
									variant="h4"
									fontWeight="bold"
									sx={{ color: "white" }}
								>
									Open Source
								</Typography>
							</Box>

							<Typography
								variant="h6"
								sx={{
									color: "rgba(255,255,255,0.8)",
									mb: 3,
									lineHeight: 1.7,
									maxWidth: 500,
								}}
							>
								Mermaid Editor is 100% open source and free to use. Contribute,
								report issues, or star the repo to show your support!
							</Typography>
						</Box>

						{/* CTA Button */}
						<MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link
								href="https://github.com/sametcn99/mermaid-viewer"
								target="_blank"
								rel="noopener noreferrer"
								underline="none"
								sx={{
									display: "inline-flex",
									alignItems: "center",
									gap: 1.5,
									px: 4,
									py: 2,
									borderRadius: "50px",
									bgcolor: "white",
									color: "#24292f",
									fontWeight: 700,
									fontSize: "1.1rem",
									boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
									"&:hover": {
										bgcolor: "#f6f8fa",
									},
									transition: "all 0.2s",
								}}
							>
								<GitHub sx={{ fontSize: 24 }} />
								View on GitHub
								<ExternalLink size={18} />
							</Link>
						</MotionBox>
					</Box>
				</MotionBox>
			</Container>
		</Box>
	);
}
