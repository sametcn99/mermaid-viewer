"use client";

import type { AiAssistantConfig } from "@/types/ai-assistant.types";
import {
	getAiAssistantConfig,
	saveAiAssistantConfig,
} from "@/lib/utils/local-storage/ai-assistant.storage";
import { Fab, Tooltip } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AiAssistantChat from "./AiAssistantChat";
import AiConsentDialog from "./AiConsentDialog";

interface AiAssistantFabProps {
	currentDiagramCode: string;
	onUpdateDiagram: (code: string) => void;
}

export default function AiAssistantFab({
	currentDiagramCode,
	onUpdateDiagram,
}: AiAssistantFabProps) {
	const [showConsentDialog, setShowConsentDialog] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [chatMinimized, setChatMinimized] = useState(false);
	const [config, setConfig] = useState<AiAssistantConfig>({
		consentGiven: false,
	});

	// Load config on mount
	useEffect(() => {
		const savedConfig = getAiAssistantConfig();
		if (savedConfig) {
			setConfig(savedConfig);
		}
	}, []);

	// Listen for open AI assistant events
	useEffect(() => {
		const handleOpenAiAssistant = () => {
			if (!config.consentGiven) {
				setShowConsentDialog(true);
			} else {
				setChatOpen(true);
				setChatMinimized(false);
			}
		};

		window.addEventListener("openAiAssistant", handleOpenAiAssistant);
		return () => {
			window.removeEventListener("openAiAssistant", handleOpenAiAssistant);
		};
	}, [config.consentGiven]);

	const handleFabClick = useCallback(() => {
		if (!config.consentGiven) {
			setShowConsentDialog(true);
		} else {
			setChatOpen(true);
			setChatMinimized(false);
		}
	}, [config.consentGiven]);

	const handleAcceptConsent = useCallback(() => {
		const newConfig: AiAssistantConfig = {
			consentGiven: true,
			lastConsentDate: Date.now(),
		};
		setConfig(newConfig);
		saveAiAssistantConfig(newConfig);
		// Notify other components about the config change
		window.dispatchEvent(new CustomEvent("aiConfigChanged"));
		setShowConsentDialog(false);
		setChatOpen(true);
		setChatMinimized(false);
	}, []);

	const handleDeclineConsent = useCallback(() => {
		setShowConsentDialog(false);
	}, []);

	const handleCloseChat = useCallback(() => {
		setChatOpen(false);
		setChatMinimized(false);
	}, []);

	const handleMinimizeChat = useCallback(() => {
		setChatMinimized(true);
	}, []);

	const handleMaximizeChat = useCallback(() => {
		setChatMinimized(false);
	}, []);

	const handleUpdateConfig = useCallback((newConfig: AiAssistantConfig) => {
		setConfig(newConfig);
		saveAiAssistantConfig(newConfig);
		// Notify other components about the config change
		window.dispatchEvent(new CustomEvent("aiConfigChanged"));
	}, []);

	return (
		<>
			{!chatOpen && (
				<Tooltip title="AI Assistant" placement="left">
					<Fab
						color="primary"
						sx={{
							position: "fixed",
							bottom: { xs: 16, sm: 24 },
							right: { xs: 16, sm: 24 },
							zIndex: 1100,
						}}
						onClick={handleFabClick}
					>
						<Sparkles size={24} />
					</Fab>
				</Tooltip>
			)}

			<AiConsentDialog
				open={showConsentDialog}
				onAccept={handleAcceptConsent}
				onDecline={handleDeclineConsent}
			/>

			<AiAssistantChat
				open={chatOpen}
				minimized={chatMinimized}
				config={config}
				currentDiagramCode={currentDiagramCode}
				onClose={handleCloseChat}
				onMinimize={handleMinimizeChat}
				onMaximize={handleMaximizeChat}
				onUpdateDiagram={onUpdateDiagram}
				onUpdateConfig={handleUpdateConfig}
			/>
		</>
	);
}
