"use client";

import {
	Box,
	Container,
	Paper,
	Typography,
	useTheme,
	Stack,
	alpha,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export default function InteractiveDemo() {
	const theme = useTheme();
	// Start with graph TD to avoid empty state confusion
	const [typedCode, setTypedCode] = useState("graph TD");

	const fullCode = `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]`;

	// Colors mimicking default Mermaid theme but adapted to Material UI theme
	const isDark = theme.palette.mode === "dark";
	const nodeBg = isDark
		? alpha(theme.palette.primary.main, 0.15)
		: alpha(theme.palette.primary.main, 0.1);
	const nodeStroke = theme.palette.primary.main;
	const methodStroke = theme.palette.text.primary;
	const textColor = theme.palette.text.primary;
	const labelBg = isDark
		? alpha(theme.palette.background.paper, 0.8)
		: alpha(theme.palette.background.paper, 0.8);

	// Typing animation loop
	useEffect(() => {
		let index = "graph TD".length;
		let direction = 1; // 1 for typing, -1 for deleting
		let pauseCounter = 0;

		const interval = setInterval(() => {
			if (pauseCounter > 0) {
				pauseCounter--;
				return;
			}

			if (direction === 1) {
				if (index < fullCode.length) {
					index++;
					setTypedCode(fullCode.slice(0, index));
				} else {
					// Finished typing, pause then start deleting
					direction = -1;
					pauseCounter = 60; // Pause for 3 seconds
				}
			} else {
				if (index > "graph TD".length) {
					// Un-type faster
					index = Math.max("graph TD".length, index - 2);
					setTypedCode(fullCode.slice(0, index));
				} else {
					// Finished deleting, pause then start typing
					direction = 1;
					pauseCounter = 20; // Pause for 1 second
					index = "graph TD".length; // Reset index to be safe
				}
			}
		}, 40);

		return () => clearInterval(interval);
	}, []);

	// Determine visibility states based on typed code
	const showNodeA = typedCode.includes("A[Start]");
	const showNodeB = typedCode.includes("B{Is it work"); // Partial match is enough
	const showEdgeAB = typedCode.includes("A[Start] --> B");

	const showNodeC = typedCode.includes("C[Great!]");
	const showEdgeBC = typedCode.includes("Yes --> C");

	const showNodeD = typedCode.includes("D[Debug]");
	const showEdgeBD = typedCode.includes("No --> D");

	return (
		<Box sx={{ py: 10, bgcolor: "background.default" }}>
			<Container maxWidth="lg">
				<Stack spacing={4} alignItems="center">
					<Typography variant="h3" fontWeight={700} textAlign="center">
						Visual Coding
					</Typography>
					<Paper
						elevation={10}
						sx={{
							width: "100%",
							maxWidth: 900,
							height: 400,
							borderRadius: 3,
							overflow: "hidden",
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							border: 1,
							borderColor: "divider",
						}}
					>
						{/* Editor Side */}
						<Box
							sx={{
								flex: 1,
								bgcolor: isDark
									? alpha(theme.palette.background.paper, 0.5)
									: "#1e1e1e", // Keep dark editor for contrast even in light mode, or match theme?
								// Usually editors are dark. Let's make it theme's paper color simply darkened.
								// Actually, standard code editors are usually dark. Let's keep it dark but tinted with primary.
								// Or just let it be a standard dark editor. To be "theme aware", maybe the border or accents?
								// Let's use a very dark version of the primary color for background?
								// No, readability is key. Let's stick to a dark background but maybe derive it.
								// Let's us a dark grey/black.

								// Re-evaluating: user wants "theme color compatible".
								// The previous hardcoded #1e1e1e is fine for an editor, but let's check text color.
								// Let's try to match the app theme more.
								bgcolor: alpha(theme.palette.text.primary, 0.05), // This would be light in light mode.
								// Code editors are often dark.
								// If I want it to look like THE app's editor, I should check what the editor looks like.
								// But here it's a demo.
								// Let's stick to a dark editor look as it contrasts well, but use theme-based gray
								bgcolor:
									theme.palette.mode === "dark"
										? alpha(theme.palette.common.white, 0.05)
										: "#1e1e1e",
								color:
									theme.palette.mode === "dark"
										? theme.palette.text.secondary
										: "#d4d4d4",
								p: 3,
								fontFamily: "monospace",
								position: "relative",
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									mb: 2,
									opacity: 0.5,
								}}
							>
								<Terminal size={14} />
								<Typography variant="caption" fontFamily="monospace">
									editor.mmd
								</Typography>
							</Box>
							<Box sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
								{typedCode}
								<Box
									component="span"
									sx={{
										display: "inline-block",
										width: "8px",
										height: "16px",
										backgroundColor: theme.palette.primary.main,
										animation: "blink 1s step-end infinite",
										verticalAlign: "middle",
										ml: 0.5,
										"@keyframes blink": {
											"0%, 100%": { opacity: 1 },
											"50%": { opacity: 0 },
										},
									}}
								/>
							</Box>
						</Box>

						{/* Preview Side */}
						<Box
							sx={{
								flex: 1,
								bgcolor: "background.paper",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderLeft: { md: 1 },
								borderTop: { xs: 1, md: 0 },
								borderColor: "divider",
								p: 2,
							}}
						>
							{/* Simulated SVG Output */}
							<Box
								component="svg"
								viewBox="0 0 500 300"
								sx={{
									width: "100%",
									height: "auto",
									maxHeight: "100%",
									fontFamily: theme.typography.fontFamily,
									"& .node": {
										transformOrigin: "center",
										transformBox: "fill-box",
										transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
										opacity: 0,
										transform: "scale(0.5)",
									},
									"& .node.visible": {
										opacity: 1,
										transform: "scale(1)",
									},
									"& .edge": {
										transition: "opacity 0.4s ease-out",
										opacity: 0,
									},
									"& .edge.visible": {
										opacity: 1,
									},
								}}
							>
								<defs>
									<marker
										id="arrowhead"
										markerWidth="10"
										markerHeight="7"
										refX="9"
										refY="3.5"
										orient="auto"
									>
										<polygon points="0 0, 10 3.5, 0 7" fill={methodStroke} />
									</marker>
								</defs>

								{/* Edge A -> B */}
								<g className={`edge ${showEdgeAB ? "visible" : ""}`}>
									<path
										d="M 250,55 L 250,110"
										stroke={methodStroke}
										strokeWidth="2"
										markerEnd="url(#arrowhead)"
										fill="none"
									/>
								</g>

								{/* Edge B -> C (Yes) */}
								<g className={`edge ${showEdgeBC ? "visible" : ""}`}>
									<path
										d="M 300,150 L 380,150"
										stroke={methodStroke}
										strokeWidth="2"
										markerEnd="url(#arrowhead)"
										fill="none"
									/>
									<rect
										x="315"
										y="130"
										width="30"
										height="20"
										fill={labelBg}
										rx="4"
									/>
									<text
										x="330"
										y="144"
										fill={textColor}
										fontSize="12"
										textAnchor="middle"
									>
										Yes
									</text>
								</g>

								{/* Edge B -> D (No) */}
								<g className={`edge ${showEdgeBD ? "visible" : ""}`}>
									<path
										d="M 200,150 L 120,150"
										stroke={methodStroke}
										strokeWidth="2"
										markerEnd="url(#arrowhead)"
										fill="none"
									/>
									<rect
										x="155"
										y="130"
										width="30"
										height="20"
										fill={labelBg}
										rx="4"
									/>
									<text
										x="170"
										y="144"
										fill={textColor}
										fontSize="12"
										textAnchor="middle"
									>
										No
									</text>
								</g>

								{/* Node A (Start) - Rect */}
								<g className={`node ${showNodeA ? "visible" : ""}`}>
									<rect
										x="210"
										y="15"
										width="80"
										height="40"
										rx="4"
										fill={nodeBg}
										stroke={nodeStroke}
										strokeWidth="2"
									/>
									<text
										x="250"
										y="40"
										fill={textColor}
										textAnchor="middle"
										fontWeight="500"
									>
										Start
									</text>
								</g>

								{/* Node B (Is it working?) - Rhombus/Diamond */}
								<g className={`node ${showNodeB ? "visible" : ""}`}>
									{/* approximated diamond shape */}
									<polygon
										points="250,110 320,150 250,190 180,150"
										fill={nodeBg}
										stroke={nodeStroke}
										strokeWidth="2"
									/>
									<text
										x="250"
										y="155"
										fill={textColor}
										textAnchor="middle"
										fontSize="14"
										fontWeight="500"
									>
										Is it working?
									</text>
								</g>

								{/* Node C (Great!) - Rect */}
								<g className={`node ${showNodeC ? "visible" : ""}`}>
									<rect
										x="380"
										y="130"
										width="80"
										height="40"
										rx="4"
										fill={nodeBg}
										stroke={nodeStroke}
										strokeWidth="2"
									/>
									<text
										x="420"
										y="155"
										fill={textColor}
										textAnchor="middle"
										fontWeight="500"
									>
										Great!
									</text>
								</g>

								{/* Node D (Debug) - Rect */}
								<g className={`node ${showNodeD ? "visible" : ""}`}>
									<rect
										x="40"
										y="130"
										width="80"
										height="40"
										rx="4"
										fill={nodeBg}
										stroke={nodeStroke}
										strokeWidth="2"
									/>
									<text
										x="80"
										y="155"
										fill={textColor}
										textAnchor="middle"
										fontWeight="500"
									>
										Debug
									</text>
								</g>
							</Box>
						</Box>
					</Paper>
				</Stack>
			</Container>
		</Box>
	);
}
