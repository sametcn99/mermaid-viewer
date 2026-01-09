"use client";

import {
	Box,
	Container,
	Typography,
	useTheme,
	Paper,
	Stack,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Eye, Share2, Sparkles } from "lucide-react";

const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);

const steps = [
	{
		icon: <Code2 size={32} />,
		title: "Write Code",
		description:
			"Use simple Mermaid syntax to describe your diagrams. No complex tools needed.",
		color: "#3b82f6",
	},
	{
		icon: <Eye size={32} />,
		title: "See Preview",
		description:
			"Watch your diagrams come to life instantly as you type with real-time rendering.",
		color: "#8b5cf6",
	},
	{
		icon: <Sparkles size={32} />,
		title: "Enhance with AI",
		description:
			"Let AI help you refine, expand, or create diagrams from natural language.",
		color: "#ec4899",
	},
	{
		icon: <Share2 size={32} />,
		title: "Export & Share",
		description:
			"Export as SVG/PNG or share via link. Embed anywhere with ease.",
		color: "#10b981",
	},
];

export default function HowItWorks() {
	const theme = useTheme();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<Box
			ref={ref}
			sx={{
				py: { xs: 10, md: 16 },
				bgcolor: "background.default",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Background decoration */}
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "100%",
					height: "100%",
					background: `radial-gradient(ellipse at center, ${theme.palette.primary.main}08 0%, transparent 70%)`,
					pointerEvents: "none",
				}}
			/>

			<Container maxWidth="lg">
				<MotionBox
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					sx={{ textAlign: "center", mb: 10 }}
				>
					<Typography
						variant="overline"
						sx={{
							color: "primary.main",
							fontWeight: 600,
							letterSpacing: 2,
							mb: 2,
							display: "block",
						}}
					>
						Simple Workflow
					</Typography>
					<Typography
						variant="h2"
						fontWeight="bold"
						sx={{ fontSize: { xs: "2rem", md: "3rem" }, mb: 2 }}
					>
						How It Works
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{ maxWidth: 600, mx: "auto" }}
					>
						Create professional diagrams in four simple steps
					</Typography>
				</MotionBox>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
						gap: 4,
						position: "relative",
					}}
				>
					{/* Connection line */}
					<Box
						sx={{
							display: { xs: "none", md: "block" },
							position: "absolute",
							top: "60px",
							left: "12%",
							right: "12%",
							height: "2px",
							background: `linear-gradient(90deg, ${steps[0].color}, ${steps[1].color}, ${steps[2].color}, ${steps[3].color})`,
							opacity: 0.3,
							zIndex: 0,
						}}
					/>

					{steps.map((step, index) => (
						<MotionPaper
							key={step.title}
							initial={{ opacity: 0, y: 50 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.5, delay: index * 0.15 }}
							elevation={0}
							sx={{
								p: 4,
								textAlign: "center",
								borderRadius: 4,
								bgcolor: "background.paper",
								border: "1px solid",
								borderColor: "divider",
								position: "relative",
								zIndex: 1,
								"&:hover": {
									borderColor: step.color,
									transform: "translateY(-8px)",
									boxShadow: `0 20px 40px -20px ${step.color}40`,
								},
								transition: "all 0.3s ease",
							}}
						>
							{/* Step number */}
							<Box
								sx={{
									position: "absolute",
									top: -16,
									left: "50%",
									transform: "translateX(-50%)",
									width: 32,
									height: 32,
									borderRadius: "50%",
									bgcolor: step.color,
									color: "white",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: "bold",
									fontSize: "0.875rem",
									boxShadow: `0 4px 12px ${step.color}50`,
								}}
							>
								{index + 1}
							</Box>

							<Box
								sx={{
									width: 64,
									height: 64,
									borderRadius: 3,
									bgcolor: `${step.color}15`,
									color: step.color,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									mx: "auto",
									mb: 3,
									mt: 2,
								}}
							>
								{step.icon}
							</Box>

							<Typography variant="h6" fontWeight="bold" gutterBottom>
								{step.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{step.description}
							</Typography>
						</MotionPaper>
					))}
				</Box>
			</Container>
		</Box>
	);
}
