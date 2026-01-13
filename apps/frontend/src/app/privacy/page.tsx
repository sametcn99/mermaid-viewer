import {
	Box,
	Container,
	Divider,
	List,
	ListItem,
	ListItemText,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

export default function PrivacyPolicyPage() {
	return (
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
				<Stack spacing={3}>
					<Box>
						<Typography variant="h4" component="h1" gutterBottom>
							Privacy Policy
						</Typography>
						<Typography variant="subtitle2" color="text.secondary">
							Last updated: January 2026
						</Typography>
					</Box>

					<Typography variant="body1">
						This Privacy Policy describes how we handle information when you use
						the Mermaid Viewer application. We keep data collection lean and
						focused on improving the product experience.
					</Typography>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Information We Collect
						</Typography>
						<List dense disablePadding>
							<ListItem disableGutters>
								<ListItemText
									primary="Product usage signals"
									secondary="Event data such as feature clicks, rendering errors, and session timings to understand reliability and performance."
								/>
							</ListItem>
							<ListItem disableGutters>
								<ListItemText
									primary="Device and technical metadata"
									secondary="Browser type, operating system, and non-identifying diagnostic information used to support compatibility and debugging."
								/>
							</ListItem>
						</List>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							How We Use Information
						</Typography>
						<Typography variant="body1" paragraph>
							We process information to operate, maintain, and improve the app,
							including stability, performance, and user experience
							enhancements.
						</Typography>
						<Typography variant="body1">
							We do not sell personal information, and we do not use collected
							data for advertising or cross-site tracking.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Data Retention
						</Typography>
						<Typography variant="body1">
							Usage and diagnostic data are retained only for as long as needed
							to analyze product performance and fulfill the purposes described
							here. User-provided content may be stored locally in your browser
							or persisted in your account if you choose to save it.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Security
						</Typography>
						<Typography variant="body1">
							We apply industry-standard security controls to protect
							information in transit and at rest. No method of transmission or
							storage is completely secure, and we encourage you to avoid
							sharing sensitive personal data in diagrams or prompts.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Third-Party Services
						</Typography>
						<Typography variant="body1">
							We may rely on trusted vendors for hosting, analytics, or AI
							processing. These providers are contractually required to
							safeguard data and use it only to deliver the services we request.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Changes to This Policy
						</Typography>
						<Typography variant="body1">
							We may update this Privacy Policy to reflect improvements or legal
							requirements. We will revise the "Last updated" date when changes
							are made.
						</Typography>
					</Box>

					<Divider />

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Contact
						</Typography>
						<Typography variant="body1">
							Questions or requests about this Privacy Policy can be sent to our
							support team. We respond to good-faith inquiries in a reasonable
							time.
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Container>
	);
}
