"use client";

import { Container, Typography, Box, useTheme } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	Zap,
	Bot,
	Cloud,
	Moon,
	Share2,
	LayoutTemplate,
	Monitor,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const MotionBox = motion.create(Box);

export default function Features() {
	const theme = useTheme();
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const features = [
		{
			icon: <Zap size={32} />,
			title: "Real-time Preview",
			description:
				"See your changes instantly as you type. No more switching contexts or waiting for renders. Catch errors early and perfect your diagrams faster.",
		},
		{
			icon: <Monitor size={32} />,
			title: "Presentation Mode",
			description:
				"Enter a distraction-free full-screen view for your diagrams. Perfect for meetings and demos. URL state is preserved.",
		},
		{
			icon: <Bot size={32} />,
			title: "AI Assistant",
			description:
				"Stuck on syntax? Just say what you want and let Gemini handle it for you. Refine and expand with ease.",
		},
		{
			icon: <Cloud size={32} />,
			title: "Cross-Device Sync",
			description:
				"Sign in with GitHub or Google to sync your diagrams across all your devices for free. Access your work from anywhere, anytime.",
		},
		{
			icon: <LayoutTemplate size={32} />,
			title: "Template Library",
			description:
				"Browse 70+ ready-made templates across 18 diagram categories including Flowcharts and Sequence diagrams to kickstart your project.",
		},
		{
			icon: <Moon size={32} />,
			title: "Dark & Light Modes",
			description:
				"Customizable interface themes to reduce eye strain. Choose from a variety of syntax highlighting themes to match your preference.",
		},
		{
			icon: <Share2 size={32} />,
			title: "Export & Share",
			description:
				"Export your diagrams as high-quality SVG or PNG images. Share diagrams with a single link or embed them in your own sites.",
		},
	];

	return (
		<Box
			ref={ref}
			sx={{
				py: { xs: 10, md: 16 },
				position: "relative",
				overflow: "hidden",
			}}
			id="features"
		>
			{/* Background gradient */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						theme.palette.mode === "dark"
							? `linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.03) 50%, transparent 100%)`
							: `linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)`,
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
						Powerful Features
					</Typography>
					<Typography
						variant="h2"
						fontWeight="bold"
						gutterBottom
						sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
					>
						Everything you need
					</Typography>
					<Typography
						variant="h6"
						color="text.secondary"
						sx={{ maxWidth: 600, mx: "auto" }}
					>
						Powerful features built for developers, by developers.
					</Typography>
				</MotionBox>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "repeat(6, 1fr)" },
						gap: 4,
					}}
				>
					{features.map((feature, index) => {
						// Create a 2-3-2 layout pattern
						// First 2 items span 3 cols each (half width)
						// Middle 3 items span 2 cols each (third width)
						// Last 2 items span 3 cols each (half width)
						const isMediumWidth = index >= 2 && index <= 4;
						const mdSpan = isMediumWidth ? "span 2" : "span 3";

						return (
							<MotionBox
								key={feature.title}
								initial={{ opacity: 0, y: 40 }}
								animate={isInView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								sx={{
									height: "100%",
									gridColumn: { xs: "span 1", md: mdSpan },
								}}
							>
								<FeatureCard {...feature} delay={index * 0.1} />
							</MotionBox>
						);
					})}
				</Box>
			</Container>
		</Box>
	);
}
