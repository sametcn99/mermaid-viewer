import {
	Box,
	Chip,
	IconButton,
	Tooltip,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Download, RotateCcw, Settings, Share2, CodeXml } from "lucide-react";
import { useState } from "react";
import ShareIframeDialog from "./ShareIframeDialog";

interface DiagramToolbarProps {
	onShareUrl: () => void;
	onDownload: () => void;
	onOpenSettings: () => void;
	onResetView: () => void;
	zoomLevel: number;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
	onShareUrl,
	onDownload,
	onOpenSettings,
	onResetView,
	zoomLevel,
}) => {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
		noSsr: true,
	});

	const handleShareClick = () => {
		setIsShareDialogOpen(true);
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: isMobile ? "auto" : { xs: 8, sm: 20 }, // Drop to bottom on very small screens
				bottom: isMobile ? 16 : "auto",
				left: { xs: 12, sm: 20 },
				right: { xs: 12, sm: 20 },
				zIndex: 10,
				display: "flex",
				justifyContent: "center",
				pointerEvents: "none", // Allow diagram interactions around the toolbar
			}}
		>
			<Box
				component="nav"
				sx={{
					pointerEvents: "auto",
					display: "flex",
					alignItems: "center",
					gap: { xs: 0.75, sm: 1 },
					flexWrap: { xs: "nowrap", sm: "wrap" },
					overflowX: { xs: "auto", sm: "visible" },
					whiteSpace: { xs: "nowrap", sm: "normal" },
					bgcolor: "background.paper",
					borderRadius: 2,
					boxShadow: 3,
					px: { xs: 1.5, sm: 1 },
					py: { xs: 1, sm: 0.5 },
					minWidth: 0,
					maxWidth: "100%",
					scrollbarWidth: "none",
					WebkitOverflowScrolling: "touch",
					"&::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				<Tooltip title="Reset View" arrow>
					<IconButton
						onClick={onResetView}
						size={"medium"}
						aria-label="Reset View"
						sx={{
							minHeight: { xs: 44, sm: 40 },
							minWidth: { xs: 44, sm: 40 },
							flexShrink: 0,
							"&:active": {
								transform: "scale(0.95)",
								transition: "transform 0.1s ease-in-out",
							},
						}}
					>
						<RotateCcw size={20} />
					</IconButton>
				</Tooltip>

				<Chip
					label={`${Math.round(zoomLevel * 100)}%`}
					size={"small"}
					sx={{
						fontWeight: "medium",
						minHeight: { xs: 36, sm: 24 }, // Larger touch target on mobile
						fontSize: { xs: "0.75rem", sm: "0.6875rem" },
						flexShrink: 0,
					}}
				/>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: { xs: 0.75, sm: 1 },
						flexShrink: 0,
					}}
				>
					<Tooltip title="Share URL" arrow>
						<IconButton
							onClick={onShareUrl}
							size={"medium"} // Always medium size for better touch targets
							aria-label="Share URL"
							sx={{
								minHeight: { xs: 44, sm: 40 }, // 44px minimum touch target
								minWidth: { xs: 44, sm: 40 },
								flexShrink: 0,
								"&:active": {
									transform: "scale(0.95)", // Touch feedback
									transition: "transform 0.1s ease-in-out",
								},
							}}
						>
							<Share2 size={20} />
						</IconButton>
					</Tooltip>
					<Tooltip title="Download SVG" arrow>
						<IconButton
							onClick={onDownload}
							size={"medium"}
							aria-label="Download SVG"
							sx={{
								minHeight: { xs: 44, sm: 40 },
								minWidth: { xs: 44, sm: 40 },
								flexShrink: 0,
								"&:active": {
									transform: "scale(0.95)",
									transition: "transform 0.1s ease-in-out",
								},
							}}
						>
							<Download size={20} />
						</IconButton>
					</Tooltip>
					<Tooltip title="Diagram Settings" arrow>
						<IconButton
							onClick={onOpenSettings}
							size={"medium"}
							aria-label="Diagram Settings"
							sx={{
								minHeight: { xs: 44, sm: 40 },
								minWidth: { xs: 44, sm: 40 },
								flexShrink: 0,
								"&:active": {
									transform: "scale(0.95)",
									transition: "transform 0.1s ease-in-out",
								},
							}}
						>
							<Settings size={20} />
						</IconButton>
					</Tooltip>
					<Tooltip title="Share Iframe" arrow>
						<IconButton
							onClick={handleShareClick}
							size={"medium"}
							aria-label="Share Iframe"
							sx={{
								minHeight: { xs: 44, sm: 40 },
								minWidth: { xs: 44, sm: 40 },
								flexShrink: 0,
								"&:active": {
									transform: "scale(0.95)",
									transition: "transform 0.1s ease-in-out",
								},
							}}
						>
							<CodeXml size={20} />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
			<ShareIframeDialog
				open={isShareDialogOpen}
				onClose={() => setIsShareDialogOpen(false)}
			/>
		</Box>
	);
};

export default DiagramToolbar;
