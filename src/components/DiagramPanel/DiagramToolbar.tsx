import { Box, IconButton, Tooltip } from "@mui/material";
import { Download, Settings, Share2 } from "lucide-react";
import type React from "react";

interface DiagramToolbarProps {
	onShareUrl: () => void;
	onDownload: () => void;
	onOpenSettings: () => void;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
	onShareUrl,
	onDownload,
	onOpenSettings,
}) => (
	<Box
		sx={{
			position: "absolute",
			top: 20,
			right: 20,
			zIndex: 10,
			display: "flex",
			gap: 1,
		}}
	>
		<Tooltip title="Share URL" arrow>
			<IconButton onClick={onShareUrl} size="small" aria-label="Share URL">
				<Share2 />
			</IconButton>
		</Tooltip>
		<Tooltip title="Download SVG" arrow>
			<IconButton onClick={onDownload} size="small" aria-label="Download SVG">
				<Download />
			</IconButton>
		</Tooltip>
		<Tooltip title="Diagram Settings" arrow>
			<IconButton
				onClick={onOpenSettings}
				size="small"
				aria-label="Diagram Settings"
			>
				<Settings />
			</IconButton>
		</Tooltip>
	</Box>
);

export default DiagramToolbar;
