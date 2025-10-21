import { Alert } from "@mui/material";
import type React from "react";

interface DiagramErrorProps {
	error: string;
}

const DiagramError: React.FC<DiagramErrorProps> = ({ error }) => (
	<Alert severity="error" sx={{ m: 2 }}>
		{error}
	</Alert>
);

export default DiagramError;
