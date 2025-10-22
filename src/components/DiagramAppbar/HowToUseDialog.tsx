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
	Bot,
	Download,
	Edit3,
	Eye,
	FileText,
	FilePlus,
	FolderOpen,
	FolderPlus,
	Monitor,
	Palette,
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
			slotProps={{
				paper: {
					sx: {
						borderRadius: 2,
						maxHeight: "90vh",
					},
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
					How to Use Mermaid Editor
				</Typography>
				<IconButton
					onClick={onClose}
					size="small"
					aria-label="Close dialog"
					sx={{
						color: "text.secondary",
					}}
				>
					<X size={20} />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Box sx={{ mb: 3 }}>
					<Typography variant="body1" paragraph>
						Mermaid Editor is a powerful tool for creating and visualizing
						Mermaid diagrams in real-time. Follow these steps to get started:
					</Typography>
				</Box>
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
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
								<FileText size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Browse 70+ Ready-Made Templates"
								secondary="Click the template icon to explore our extensive collection of 18 diagram categories including Flowcharts, Sequence diagrams, C4 Architecture, Sankey flows, Network diagrams, and more!"
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

						<ListItem>
							<ListItemIcon>
								<Bot size={20} />
							</ListItemIcon>
							<ListItemText
								primary="AI Assistant (Powered by Gemini)"
								secondary="Click the AI assistant button to get help creating, modifying, or fixing your Mermaid diagrams using Google's Gemini AI. The assistant can generate diagrams from descriptions, fix syntax errors, and suggest improvements."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>{" "}
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
					>
						<Monitor size={20} />
						Presentation Mode
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<Monitor size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Enter Full-Screen Viewer"
								secondary="Use the 'Enter Presentation' button in the top AppBar (or the mobile menu) to open a distraction-free, full-viewport view of your diagram."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Share2 size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Keeps Your URL State"
								secondary="Your current diagram is preserved via the encoded 'diagram' URL parameter when entering and exiting presentation mode."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Eye size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Focused Viewing Only"
								secondary="The diagram toolbar is hidden in presentation mode for a clean viewing experience."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<X size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Exit with Esc or Button"
								secondary="Press Escape or use the floating back button to return to the editor with your diagram intact."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
					>
						<FileText size={20} />
						Template Library
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<FileText size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Search & Filter Templates"
								secondary="Use the search bar and category filters to quickly find the perfect template for your needs. Templates include detailed descriptions and tags."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<FolderPlus size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Organize Personal Collections"
								secondary="Create named collections to group your favorite templates and reorder them for quick access."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<FilePlus size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Save Your Current Diagram as a Template"
								secondary="Use the “Save Current Diagram” action in My Collections to capture custom snippets that stay in your browser."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
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

						<ListItem>
							<ListItemIcon>
								<Share2 size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Embed as Iframe"
								secondary="Use the iframe sharing feature to embed your diagram directly into any website or blog. Click the share button and select 'Embed as iframe' to copy the HTML code. Paste it wherever you want to display your diagram."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
					>
						<Palette size={20} />
						Diagram Settings
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<Palette size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Customize Diagram Appearance"
								secondary="Click the settings icon in the diagram toolbar to customize theme, colors, fonts, and layout. Your preferences are automatically saved to browser storage."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Save size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Persistent Configuration"
								secondary="All your diagram settings (theme, colors, spacing, etc.) are saved locally and will be restored when you return to the app."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
					>
						<Bot size={20} />
						AI Assistant
					</Typography>

					<List>
						<ListItem>
							<ListItemIcon>
								<Bot size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Powered by Google Gemini"
								secondary="Chat with an AI assistant that understands Mermaid syntax and can help you create diagrams from natural language descriptions."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Edit3 size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Generate & Modify Diagrams"
								secondary="Ask the AI to create new diagrams, modify existing ones, fix syntax errors, or suggest improvements. It understands your current diagram content."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>

						<ListItem>
							<ListItemIcon>
								<Save size={20} />
							</ListItemIcon>
							<ListItemText
								primary="Free to Use with Optional Personal API Key"
								secondary="The AI assistant works out of the box using our default API key. If you prefer to use your own key or if the default key reaches its limit, you can easily add your personal Gemini API key. Your key is stored securely in your browser and never sent to our servers."
								slotProps={{ primary: { fontWeight: 500 } }}
							/>
						</ListItem>
					</List>
				</Box>{" "}
				<Divider sx={{ my: 3 }} />
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h3"
						component="h3"
						gutterBottom
						fontWeight="600"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							mb: 2,
							fontSize: "1.25rem",
						}}
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
