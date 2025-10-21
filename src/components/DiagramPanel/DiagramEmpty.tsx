import { Box } from "@mui/material";
import type React from "react";

const DiagramEmpty: React.FC = () => (
	<Box
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100%",
			color: "text.secondary",
		}}
	>
		Enter Mermaid code in the editor.
	</Box>
);

export default DiagramEmpty;
