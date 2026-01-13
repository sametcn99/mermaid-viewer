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

export default function TermsOfServicePage() {
	return (
		<Container maxWidth="md" sx={{ py: 8 }}>
			<Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
				<Stack spacing={3}>
					<Box>
						<Typography variant="h4" component="h1" gutterBottom>
							Terms of Service
						</Typography>
						<Typography variant="subtitle2" color="text.secondary">
							Last updated: January 2026
						</Typography>
					</Box>

					<Typography variant="body1">
						These Terms of Service govern your access to and use of Mermaid
						Viewer. By using the application you agree to be bound by these
						terms.
					</Typography>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Eligibility and Account Security
						</Typography>
						<Typography variant="body1" paragraph>
							You must have the legal authority to enter into these terms. You
							are responsible for maintaining the security of your devices and
							any credentials or API keys you choose to use within the app.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Acceptable Use
						</Typography>
						<List dense disablePadding>
							<ListItem disableGutters>
								<ListItemText primary="Do not misuse the service, interfere with others' use, or attempt to access systems without authorization." />
							</ListItem>
							<ListItem disableGutters>
								<ListItemText primary="Respect intellectual property rights when creating or sharing diagrams." />
							</ListItem>
							<ListItem disableGutters>
								<ListItemText primary="Comply with all applicable laws, regulations, and third-party terms (for example, AI model providers)." />
							</ListItem>
						</List>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Service Availability and Changes
						</Typography>
						<Typography variant="body1">
							We aim for reliable, performant service but do not guarantee
							uninterrupted availability. Features may change or be discontinued
							at our discretion to improve the product.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Third-Party Services
						</Typography>
						<Typography variant="body1">
							The app may integrate third-party services (such as hosting,
							analytics, or AI providers). Your use of those services is subject
							to their terms and privacy practices, which we do not control.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Disclaimers
						</Typography>
						<Typography variant="body1">
							The service is provided on an "as is" and "as available" basis
							without warranties of any kind, whether express or implied,
							including merchantability, fitness for a particular purpose, or
							non-infringement.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Limitation of Liability
						</Typography>
						<Typography variant="body1">
							To the maximum extent permitted by law, we are not liable for
							indirect, incidental, special, consequential, or punitive damages,
							or any loss of data, profits, or revenue arising from your use of
							the service.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Indemnity
						</Typography>
						<Typography variant="body1">
							You agree to indemnify and hold harmless the project maintainers
							and contributors from claims, damages, or expenses arising from
							your use of the service or violation of these terms.
						</Typography>
					</Box>

					<Box>
						<Typography variant="h6" component="h2" gutterBottom>
							Changes to These Terms
						</Typography>
						<Typography variant="body1">
							We may update these terms to reflect product or legal changes. The
							updated version will be indicated by the "Last updated" date.
							Continued use after changes become effective constitutes
							acceptance.
						</Typography>
					</Box>
				</Stack>
			</Paper>
		</Container>
	);
}
