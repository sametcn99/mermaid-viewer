"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { FolderOpen, Grid, Pencil } from "lucide-react";
import type React from "react";

interface DiagramEmptyProps {
	onOpenTemplates?: () => void;
	onOpenSavedDiagrams?: () => void;
	hasSavedDiagrams?: boolean;
}

const DiagramEmpty: React.FC<DiagramEmptyProps> = ({
	onOpenTemplates,
	onOpenSavedDiagrams,
	hasSavedDiagrams = false,
}) => {
	const handleOpenTemplates = () => {
		if (onOpenTemplates) {
			onOpenTemplates();
		} else if (typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("openTemplateDialog"));
		}
	};

	const handleOpenSavedDiagrams = () => {
		if (onOpenSavedDiagrams) {
			onOpenSavedDiagrams();
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				p: 3,
			}}
		>
			<Paper
				elevation={0}
				sx={{
					p: 6,
					maxWidth: 480,
					width: "100%",
					textAlign: "center",
				}}
			>
				<Stack spacing={3} alignItems="center">
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: "50%",
							bgcolor: "action.hover",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Pencil style={{ fontSize: 40, color: "text.secondary" }} />
					</Box>

					<Stack spacing={1} alignItems="center">
						<Typography variant="h6" component="h2" fontWeight={600}>
							No Diagram Yet
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ maxWidth: 360 }}
						>
							Start creating your diagram by typing in the editor or choose from
							our pre-built templates to get started quickly
						</Typography>
					</Stack>

					<Stack spacing={2} sx={{ width: "100%", maxWidth: 280 }}>
						<Button
							variant="contained"
							size="large"
							startIcon={<Grid />}
							onClick={handleOpenTemplates}
							fullWidth
						>
							Browse Templates
						</Button>

						{hasSavedDiagrams && (
							<Button
								variant="outlined"
								size="large"
								startIcon={<FolderOpen />}
								onClick={handleOpenSavedDiagrams}
								fullWidth
							>
								Open Saved Diagrams
							</Button>
						)}
					</Stack>
				</Stack>
			</Paper>
		</Box>
	);
};

export default DiagramEmpty;
