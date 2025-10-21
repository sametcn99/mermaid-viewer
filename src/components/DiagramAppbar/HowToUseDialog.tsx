"use client";

import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import {
	Download,
	Edit3,
	Eye,
	FolderOpen,
	Save,
	Share2,
	X,
	Zap,
} from "lucide-react";

interface HowToUseDialogProps {
	open: boolean;
	onClose: () => void;
}

export default function HowToUseDialog({ open, onClose }: HowToUseDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					maxHeight: "90vh",
				},
			}}
		>
			<DialogTitle
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					pb: 1,
				}}
			>
				<Typography variant="h5" component="div" fontWeight="600">
					How to Use Mermaid Viewer
				</Typography>
				<IconButton
					onClick={onClose}
					size="small"
					sx={{
						color: "text.secondary",
					}}
				>
					<X size={20} />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Box sx={{ mb: 3 }}>
					<Typography variant="body1" color="text.secondary" paragraph>
						Mermaid Viewer is a powerful tool for creating and visualizing
						Mermaid diagrams in real-time. Follow these steps to get started:
					</Typography>
				</Box>

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h6"
						gutterBottom
						fontWeight="600"
						sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
					>
						<Zap size={20} />
						Quick Start
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<Edit3 size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Write Your Diagram"
								secondary="Type or paste your Mermaid code in the left editor panel. The syntax will be highlighted automatically."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Eye size={20} />
							</ListItemIcon>
							<ListItemText
								primary="View Live Preview"
								secondary="Your diagram will render automatically in the right panel as you type. No need to click any button!"
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Save size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Save Your Work"
								secondary="Click the Save icon in the toolbar to save your diagram locally. You can save multiple diagrams."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<FolderOpen size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Load Saved Diagrams"
								secondary="Use the folder icon to open and manage your previously saved diagrams."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h6"
						gutterBottom
						fontWeight="600"
						sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
					>
						<Download size={20} />
						Export & Share
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<Download size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Download as SVG or PNG"
								secondary="Use the toolbar below the diagram to download your visualization in different formats."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Share2 size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Share Your Diagram"
								secondary="Your diagram content is encoded in the URL. Simply copy and share the URL with others to share your work!"
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h6"
						gutterBottom
						fontWeight="600"
						sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
					>
						📚 Learn Mermaid Syntax
					</Typography>
					<Paper
						variant="outlined"
						sx={{
							p: 2,
							bgcolor: "background.default",
						}}
					>
						<Typography variant="body2" color="text.secondary" paragraph>
							New to Mermaid? Check out the official documentation to learn
							about all diagram types and syntax:
						</Typography>
						<Link
							href="https://mermaid.js.org/intro/"
							target="_blank"
							rel="noopener noreferrer"
							underline="hover"
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 0.5,
								fontWeight: 500,
							}}
						>
							Official Mermaid Documentation →
						</Link>
					</Paper>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ textAlign: "center", pt: 2 }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						This is an open-source project. Click the link below to explore the
						source code and contribute!
					</Typography>
					<Link
						href="https://sametcc.me/repo/mermaid-viewer"
						target="_blank"
						rel="noopener noreferrer"
						underline="hover"
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 0.5,
							fontWeight: 500,
							fontSize: "1rem",
							mt: 1,
						}}
					>
						View on GitHub →
					</Link>
				</Box>
			</DialogContent>
		</Dialog>
	);
}
