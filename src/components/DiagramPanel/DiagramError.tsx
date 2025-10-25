import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { Bot } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { getAiAssistantConfig } from "@/lib/utils/local-storage/ai-assistant.storage";

interface DiagramErrorProps {
	error: string;
	currentCode?: string;
	onRequestFix?: (errorMessage: string, code: string) => Promise<void>;
	ai?: {
		consentGiven: boolean;
		onRequestConsent: () => void;
	};
}

const DiagramError: React.FC<DiagramErrorProps> = ({
	error,
	currentCode = "",
	onRequestFix,
	ai,
}) => {
	const [isFixing, setIsFixing] = useState(false);
	const [localAiConsentGiven, setLocalAiConsentGiven] = useState(
		ai?.consentGiven || false,
	);

	// Listen for AI config changes
	useEffect(() => {
		const handleAiConfigChange = () => {
			const config = getAiAssistantConfig();
			setLocalAiConsentGiven(config?.consentGiven || false);
		};

		window.addEventListener("aiConfigChanged", handleAiConfigChange);
		return () => {
			window.removeEventListener("aiConfigChanged", handleAiConfigChange);
		};
	}, []);

	// Update local state when ai prop changes
	useEffect(() => {
		setLocalAiConsentGiven(ai?.consentGiven || false);
	}, [ai?.consentGiven]);

	const handleFixWithAI = async () => {
		if (!localAiConsentGiven) {
			ai?.onRequestConsent();
			return;
		}

		if (onRequestFix) {
			setIsFixing(true);
			try {
				await onRequestFix(error, currentCode);
			} finally {
				setIsFixing(false);
			}
		}
	};

	return (
		<Box sx={{ m: 2 }}>
			<Alert severity="error" sx={{ mb: onRequestFix ? 2 : 0 }}>
				{error}
			</Alert>
			{onRequestFix && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
					<Button
						variant="contained"
						size="small"
						startIcon={
							isFixing ? (
								<CircularProgress size={16} color="inherit" />
							) : (
								<Bot size={16} />
							)
						}
						onClick={handleFixWithAI}
						disabled={isFixing}
						sx={{
							borderRadius: 3,
							textTransform: "none",
							fontWeight: 600,
							px: 3,
							bgcolor: "primary.main",
							color: "primary.contrastText",
							boxShadow: "0px 2px 8px rgba(25, 118, 210, 0.25)",
							"&:hover": {
								bgcolor: "primary.dark",
								boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.35)",
							},
							"&:disabled": {
								bgcolor: "action.disabledBackground",
								color: "action.disabled",
							},
						}}
					>
						{isFixing
							? "Fixing..."
							: !localAiConsentGiven
								? "Enable AI"
								: "Auto Fix"}
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default DiagramError;
