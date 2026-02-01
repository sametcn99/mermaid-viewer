"use client";

import {
	Box,
	Button,
	IconButton,
	Paper,
	Typography,
	useTheme,
	Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";
// Using font-awesome icons as seen in layout.tsx import
// or we can use MUI icons if available. Let's use MUI icons for consistency with AlertSnackbar if possible
// but layout.tsx imports font-awesome. Let's check package.json again.
import { useAnalytics } from "@/hooks/useAnalytics";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";

const STORAGE_KEY_FIRST_VISIT = "mermaid_viewer_first_visit";
const STORAGE_KEY_PREFERENCE = "mermaid_viewer_support_toast_hidden_until";
const DAYS_TO_HIDE = 30;

export default function SupportToast() {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const { track } = useAnalytics();

	useEffect(() => {
		const checkAndShowToast = () => {
			const now = new Date().getTime();
			const firstVisit = localStorage.getItem(STORAGE_KEY_FIRST_VISIT);
			const hiddenUntil = localStorage.getItem(STORAGE_KEY_PREFERENCE);

			// Logic:
			// 1. If no first_visit record -> set it and DO NOT show (new user).
			// 2. If first_visit exists -> check preference.
			// 3. If hiddenUntil > now -> DO NOT show.
			// 4. Else -> Show.

			if (!firstVisit) {
				localStorage.setItem(STORAGE_KEY_FIRST_VISIT, now.toString());
				return;
			}

			if (hiddenUntil && Number.parseInt(hiddenUntil) > now) {
				return;
			}

			// If we are here, it's a returning user and not hidden
			// Small delay to not be annoying immediately on load
			const timer = setTimeout(() => {
				setOpen(true);
				track("support_toast_impression");
			}, 2000);

			return () => clearTimeout(timer);
		};

		checkAndShowToast();
	}, [track]);

	const handleClose = () => {
		track("support_toast_close");
		setOpen(false);
	};

	const handleDontShowAgain = () => {
		track("support_toast_dont_show_again");
		const now = new Date();
		const futureDate = new Date(now.setDate(now.getDate() + DAYS_TO_HIDE));
		localStorage.setItem(
			STORAGE_KEY_PREFERENCE,
			futureDate.getTime().toString(),
		);
		setOpen(false);
	};

	if (!open) return null;

	return (
		<Zoom in={open}>
			<Paper
				elevation={6}
				sx={{
					position: "fixed",
					bottom: 24,
					right: 24,
					zIndex: 2000,
					maxWidth: 350,
					p: 2,
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
					background: theme.palette.background.paper,
					display: "flex",
					flexDirection: "column",
					gap: 1.5,
				}}
			>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="flex-start"
				>
					<Box display="flex" gap={1.5} alignItems="center">
						<Box
							sx={{
								backgroundColor: theme.palette.primary.main,
								color: theme.palette.primary.contrastText,
								borderRadius: "50%",
								p: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: 40,
								height: 40,
							}}
						>
							<FavoriteIcon fontSize="small" />
						</Box>
						<Typography variant="subtitle1" fontWeight="bold">
							Enjoying Mermaid Viewer?
						</Typography>
					</Box>
					<IconButton
						size="small"
						onClick={handleClose}
						aria-label="close"
						sx={{ mt: -1, mr: -1 }}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				<Typography variant="body2" color="text.secondary">
					Consider supporting me! You can give a star on GitHub or support me
					directly to keep the updates coming.
				</Typography>

				<Box display="flex" gap={1} flexWrap="wrap">
					<Button
						variant="outlined"
						size="small"
						startIcon={<StarIcon />}
						href="https://github.com/sametcn99/mermaid-viewer"
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => track("support_toast_star_click")}
						sx={{ flex: 1 }}
					>
						Star
					</Button>
					<Button
						variant="contained"
						size="small"
						color="primary"
						startIcon={<FavoriteIcon />}
						href="https://sametcc.me/support"
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => track("support_toast_support_click")}
						sx={{ flex: 1 }}
					>
						Support
					</Button>
				</Box>

				<Button
					color="inherit"
					size="small"
					onClick={handleDontShowAgain}
					sx={{
						alignSelf: "flex-end",
						opacity: 0.7,
						fontSize: "0.75rem",
						"&:hover": { opacity: 1, background: "transparent" },
					}}
				>
					Don't show again
				</Button>
			</Paper>
		</Zoom>
	);
}
