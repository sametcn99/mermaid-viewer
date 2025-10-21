import { Box, IconButton, Tooltip } from "@mui/material";
import { Download, Share2 } from "lucide-react";
import type React from "react";

interface DiagramToolbarProps {
	onShareUrl: () => void;
	onDownload: () => void;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
	onShareUrl,
	onDownload,
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
	</Box>
);

export default DiagramToolbar;
