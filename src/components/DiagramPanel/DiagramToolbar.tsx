import { Box, Chip, IconButton, Tooltip } from "@mui/material";
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

	const handleShareClick = () => {
	
		setIsShareDialogOpen(true);
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: { xs: 8, sm: 20 }, // Closer to top on mobile
				left: { xs: 8, sm: 20 },
				right: { xs: 8, sm: 20 },
				zIndex: 10,
				display: "flex",
				justifyContent: "space-between",
				gap: { xs: 0.5, sm: 1 }, // Tighter spacing on mobile
				alignItems: "center",
				flexWrap: "wrap", // Allow wrapping on very small screens
				// Touch optimization
				borderRadius: { xs: 2, sm: 0 },
				p: { xs: 0.5, sm: 0 },
			}}
		>
			{/* Left: Reset button */}
			<Tooltip title="Reset View" arrow>
				<IconButton
					onClick={onResetView}
					size={"medium"}
					aria-label="Reset View"
					sx={{
						minHeight: { xs: 44, sm: 40 },
						minWidth: { xs: 44, sm: 40 },
						"&:active": {
							transform: "scale(0.95)",
							transition: "transform 0.1s ease-in-out",
						},
					}}
				>
					<RotateCcw size={20} />
				</IconButton>
			</Tooltip>

			{/* Right: group remaining controls */}
			<Box
				sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, alignItems: "center" }}
			>
				<Chip
					label={`${Math.round(zoomLevel * 100)}%`}
					size={"small"}
					sx={{
						fontWeight: "medium",
						minHeight: { xs: 36, sm: 24 }, // Larger touch target on mobile
						fontSize: { xs: "0.75rem", sm: "0.6875rem" },
					}}
				/>
				<Tooltip title="Share URL" arrow>
					<IconButton
						onClick={onShareUrl}
						size={"medium"} // Always medium size for better touch targets
						aria-label="Share URL"
						sx={{
							minHeight: { xs: 44, sm: 40 }, // 44px minimum touch target
							minWidth: { xs: 44, sm: 40 },
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
							"&:active": {
								transform: "scale(0.95)",
								transition: "transform 0.1s ease-in-out",
							},
						}}
					>
						<Settings size={20} />
					</IconButton>
				</Tooltip>
				<Tooltip title="Share Diagram" arrow>
					<IconButton
						onClick={handleShareClick}
						size={"medium"}
						aria-label="Share Diagram"
						sx={{
							minHeight: { xs: 44, sm: 40 },
							minWidth: { xs: 44, sm: 40 },
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
			<ShareIframeDialog
				open={isShareDialogOpen}
				onClose={() => setIsShareDialogOpen(false)}
			/>
		</Box>
	);
};

export default DiagramToolbar;
