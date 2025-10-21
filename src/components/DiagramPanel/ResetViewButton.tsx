import { Box, IconButton, Tooltip } from "@mui/material";
import { RotateCcw } from "lucide-react";
import type React from "react";

interface ResetViewButtonProps {
	onReset: () => void;
}

const ResetViewButton: React.FC<ResetViewButtonProps> = ({ onReset }) => (
	<Box
		sx={{
			position: "absolute",
			top: 20,
			left: 20,
			zIndex: 1000,
		}}
	>
		<Tooltip title="Reset View" arrow>
			<IconButton
				onClick={() => {
					console.log("Reset button clicked");
					onReset();
				}}
				size="small"
				aria-label="Reset View"
			>
				<RotateCcw />
			</IconButton>
		</Tooltip>
	</Box>
);

export default ResetViewButton;
