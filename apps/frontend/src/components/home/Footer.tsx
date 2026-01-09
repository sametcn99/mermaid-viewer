"use client";

import {
	Box,
	Container,
	Grid,
	IconButton,
	Stack,
	Typography,
	Link as MuiLink,
	Divider,
	Chip,
} from "@mui/material";
import { GitHub, Email, Coffee } from "@mui/icons-material";

const footerLinks = {
	resources: {
		title: "Resources",
		links: [
			{
				label: "Mermaid Documentation",
				href: "https://mermaid.js.org/intro/getting-started.html",
				external: true,
			},
			{
				label: "GitHub Repository",
				href: "https://sametcc.me/repo/mermaid-viewer",
				external: true,
			},
			{
				label: "Report an Issue",
				href: "https://github.com/sametcn99/mermaid-viewer/issues",
				external: true,
			},
		],
	},
	legal: {
		title: "Legal",
		links: [
			{ label: "Privacy Policy", href: "/privacy", external: true },
			{ label: "Terms of Service", href: "/terms", external: true },
		],
	},
};

const socialLinks = [
	{ icon: <GitHub />, href: "https://github.com/sametcn99", label: "GitHub" },
	{ icon: <Email />, href: "mailto:sametcn99@gmail.com", label: "Email" },
	{
		icon: <Coffee />,
		href: "https://buymeacoffee.com/sametcn99",
		label: "Buy Me a Coffee",
	},
];

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				pt: 8,
				pb: 4,
				borderTop: 1,
				borderColor: "divider",
				bgcolor: "background.paper",
				background: (theme) =>
					theme.palette.mode === "dark"
						? "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(18,18,18,1) 100%)"
						: "linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,1) 100%)",
			}}
		>
			<Container maxWidth="lg">
				{/* Main Footer Content */}
				<Grid container spacing={4}>
					{/* Brand Section */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Stack spacing={2}>
							<Typography variant="h5" fontWeight="bold">
								Mermaid Editor
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ maxWidth: 280 }}
							>
								Create beautiful diagrams and visualizations with our powerful,
								open-source Mermaid editor. Design flowcharts, sequence
								diagrams, and more with ease.
							</Typography>

							{/* Social Links */}
							<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
								{socialLinks.map((social) => (
									<IconButton
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.label}
										size="small"
										sx={{
											color: "text.secondary",
											transition: "all 0.2s ease-in-out",
											"&:hover": {
												color: "primary.main",
												transform: "translateY(-2px)",
											},
										}}
									>
										{social.icon}
									</IconButton>
								))}
							</Stack>
						</Stack>
					</Grid>

					{/* Links Sections */}
					{Object.entries(footerLinks).map(([key, section]) => (
						<Grid size={{ xs: 6, sm: 4, md: 2 }} key={key}>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="text.primary"
								sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 1 }}
							>
								{section.title}
							</Typography>
							<Stack spacing={1.5}>
								{section.links.map((link) => (
									<MuiLink
										key={link.label}
										href={link.href}
										target={link.external ? "_blank" : undefined}
										rel={link.external ? "noopener noreferrer" : undefined}
										underline="none"
										color="text.secondary"
										sx={{
											fontSize: "0.875rem",
											transition: "all 0.2s ease-in-out",
											"&:hover": {
												color: "primary.main",
												pl: 0.5,
											},
										}}
									>
										{link.label}
										{link.external && (
											<Typography
												component="span"
												sx={{ fontSize: "0.7rem", ml: 0.5 }}
											>
												↗
											</Typography>
										)}
									</MuiLink>
								))}
							</Stack>
						</Grid>
					))}

					{/* Newsletter/CTA Section */}
					<Grid size={{ xs: 12, sm: 6, md: 2 }}>
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							color="text.primary"
							sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 1 }}
						>
							Get Started
						</Typography>
						<Stack spacing={1.5}>
							<MuiLink
								href="/"
								underline="none"
								sx={{
									display: "inline-flex",
									alignItems: "center",
									gap: 1,
									px: 2,
									py: 1,
									borderRadius: 2,
									bgcolor: "primary.main",
									color: "primary.contrastText",
									fontSize: "0.875rem",
									fontWeight: 600,
									transition: "all 0.2s ease-in-out",
									"&:hover": {
										bgcolor: "primary.dark",
										boxShadow: 2,
										textDecoration: "underline",
									},
								}}
							>
								Open Editor →
							</MuiLink>
							<Typography variant="caption" color="text.secondary">
								No sign-up required. Start creating diagrams instantly.
							</Typography>
						</Stack>
					</Grid>
				</Grid>

				{/* Bottom Bar */}
				<Divider sx={{ my: 4 }} />

				{/* Support Section */}
				<Box
					sx={{
						mb: 3,
						p: 2,
						borderRadius: 2,
						background: (theme) =>
							theme.palette.mode === "dark"
								? "linear-gradient(135deg, rgba(255,202,40,0.1) 0%, rgba(255,167,38,0.1) 100%)"
								: "linear-gradient(135deg, rgba(255,202,40,0.15) 0%, rgba(255,167,38,0.15) 100%)",
						border: "1px solid",
						borderColor: (theme) =>
							theme.palette.mode === "dark"
								? "rgba(255,202,40,0.3)"
								: "rgba(255,167,38,0.4)",
						textAlign: "center",
					}}
				>
					<Stack
						direction="row"
						spacing={1}
						justifyContent="center"
						alignItems="center"
						flexWrap="wrap"
					>
						<Coffee sx={{ color: "#FFCA28", fontSize: 20 }} />
						<Typography variant="body2" color="text.secondary">
							Enjoying Mermaid Editor?
						</Typography>
						<MuiLink
							href="https://buymeacoffee.com/sametcn99"
							target="_blank"
							rel="noopener noreferrer"
							underline="none"
							sx={{
								fontWeight: 600,
								color: "#FFCA28",
								transition: "all 0.2s ease-in-out",
								"&:hover": {
									textDecoration: "underline",
									color: "#FFB300",
								},
							}}
						>
							Buy me a coffee ☕
						</MuiLink>
						<Typography variant="body2" color="text.secondary">
							to help ship faster and keep features free!
						</Typography>
					</Stack>
				</Box>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					justifyContent="space-between"
					alignItems="center"
					spacing={2}
				>
					<Typography variant="body2" color="text.secondary">
						© {currentYear} Mermaid Editor. Built by{" "}
						<MuiLink
							href="https://sametcc.me"
							target="_blank"
							rel="noopener noreferrer"
							underline="hover"
							sx={{ fontWeight: 600 }}
						>
							sametcc.me
						</MuiLink>
					</Typography>

					<Stack direction="row" spacing={2} alignItems="center">
						<Chip
							label="Open Source"
							size="small"
							color="success"
							variant="outlined"
							sx={{ borderRadius: 2 }}
						/>
						<Chip
							label="GPL-3.0 License"
							size="small"
							variant="outlined"
							sx={{ borderRadius: 2 }}
						/>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
