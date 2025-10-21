"use client";

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from "@mui/material";
import { Sparkles } from "lucide-react";

interface AiConsentDialogProps {
	open: boolean;
	onAccept: () => void;
	onDecline: () => void;
}

export default function AiConsentDialog({
	open,
	onAccept,
	onDecline,
}: AiConsentDialogProps) {
	return (
		<Dialog
			open={open}
			onClose={onDecline}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
					overflow: "hidden",
				},
			}}
			TransitionProps={{
				timeout: 300,
			}}
		>
			<DialogTitle
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					bgcolor: "primary.main",
					color: "primary.contrastText",
					py: 2,
				}}
			>
				<Sparkles size={24} />
				Enable AI Assistant
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ mb: 2 }}>
					Would you like to use the AI assistant to help you create and edit
					Mermaid diagrams?
				</DialogContentText>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					<strong>How it works:</strong>
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					component="ul"
					sx={{ pl: 2 }}
				>
					<li>Uses free Google Gemini API</li>
					<li>Can create and edit your diagrams</li>
					<li>All changes are applied automatically (you can undo them)</li>
					<li>Your chat history is stored on your device</li>
				</Typography>
				<Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
					<strong>Note:</strong> When the API limit is reached, you can continue
					using your own Gemini API key.
				</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2.5, bgcolor: "background.paper" }}>
				<Button
					onClick={onDecline}
					color="inherit"
					variant="outlined"
					sx={{ borderRadius: 28, px: 2 }}
				>
					Cancel
				</Button>
				<Button
					onClick={onAccept}
					variant="contained"
					startIcon={<Sparkles size={18} />}
					sx={{
						borderRadius: 28,
						px: 3,
						boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.25)",
						"&:hover": {
							boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.35)",
						},
					}}
				>
					Enable
				</Button>
			</DialogActions>
		</Dialog>
	);
}
