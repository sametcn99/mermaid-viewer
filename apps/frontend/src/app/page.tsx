"use client";

import AiAssistantFab from "@/components/AiAssistant/AiAssistantFab";
import AlertSnackbar from "@/components/AlertSnackbar";
import ResizablePanels from "@/components/ResizablePanels";
import { getAiAssistantConfig } from "@/lib/indexed-db/ai-assistant.storage";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { AiAssistantConfig } from "@/types/ai-assistant.types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@/components/AppBar";
import type { AppDispatch, RootState } from "@/store";
import {
	cancelMermaidDebounce,
	dismissMermaidAlert,
	initializeMermaidState,
	updateMermaidFromEditor,
} from "@/store/mermaidSlice";
import LoadDiagramDialog from "@/components/LoadDiagramDialog";

export default function Home() {
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === "dark";
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const dispatch = useDispatch<AppDispatch>();
	const { mermaidCode, debouncedCode, alertMessage, hasUnsavedChanges } =
		useSelector((state: RootState) => state.mermaid);
	const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
		consentGiven: false,
	});

	useEffect(() => {
		dispatch(initializeMermaidState());
		return () => {
			dispatch(cancelMermaidDebounce());
		};
	}, [dispatch]);

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				const message =
					"You have unsaved changes. Are you sure you want to leave?";
				event.preventDefault();
				event.returnValue = message;
				return message;
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	const handleEditorChange = useCallback(
		(value: string) => {
			dispatch(updateMermaidFromEditor(value));
		},
		[dispatch],
	);

	const handleAlertClose = useCallback(() => {
		dispatch(dismissMermaidAlert());
	}, [dispatch]);

	// Load AI config on mount and listen for changes
	useEffect(() => {
		let isMounted = true;
		const loadConfig = async () => {
			const savedConfig = await getAiAssistantConfig();
			if (savedConfig && isMounted) {
				setAiConfig(savedConfig);
			}
		};
		loadConfig();

		// Listen for AI config changes
		const handleAiConfigChange = async () => {
			const updatedConfig = await getAiAssistantConfig();
			if (updatedConfig && isMounted) {
				setAiConfig(updatedConfig);
			}
		};

		window.addEventListener("aiConfigChanged", handleAiConfigChange);
		return () => {
			isMounted = false;
			window.removeEventListener("aiConfigChanged", handleAiConfigChange);
		};
	}, []);

	const handleRequestConsent = useCallback(() => {
		// Dispatch an event to open the AI FAB
		window.dispatchEvent(new CustomEvent("openAiAssistant"));
	}, []);

	const handleRequestFix = useCallback(
		async (errorMessage: string, code: string) => {
			try {
				// Prepare the fix message
				const fixMessage = `I'm getting this error in my Mermaid diagram. Please fix the error and return only the corrected Mermaid code without any explanation:\n\nError: ${errorMessage}\n\nCurrent code:\n\`\`\`mermaid\n${code}\n\`\`\`\n\nReturn only the fixed Mermaid code.`;

				// Get the AI config
				const aiConfig = await getAiAssistantConfig();

				// Send a direct request to the API
				const response = await fetch("/api/gemini", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: fixMessage,
						currentDiagramCode: code,
						chatHistory: [], // Without chat history
						userApiKey: aiConfig?.userApiKey,
						selectedModel: aiConfig?.selectedModel || "gemini-2.5-flash",
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					if (data.needsApiKey) {
						// If an API key is required, open the AI assistant
						window.dispatchEvent(new CustomEvent("openAiAssistant"));
					}
					return;
				}

				// Apply the corrected code to the editor
				if (data.mermaidCode) {
					handleEditorChange(data.mermaidCode);
				} else if (data.response) {
					// If mermaidCode is missing, try extracting the code from the response
					const codeMatch = data.response.match(
						/```mermaid\n?([\s\S]*?)\n?```/,
					);
					if (codeMatch?.[1]) {
						handleEditorChange(codeMatch[1].trim());
					} else {
						// If no code block exists, use the entire response (cleaned)
						const cleanedCode = data.response
							.replace(/^Here's the fixed code:\s*/i, "")
							.replace(/^Fixed code:\s*/i, "")
							.replace(/^```mermaid\s*/, "")
							.replace(/\s*```\s*$/, "")
							.trim();
						if (cleanedCode) {
							handleEditorChange(cleanedCode);
						}
					}
				}
			} catch (error) {
				console.error("Error fixing diagram:", error);
				// In case of an error, open the AI assistant
				window.dispatchEvent(new CustomEvent("openAiAssistant"));
			}
		},
		[handleEditorChange],
	);

	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			<AppBar />
			<ResizablePanels
				isSmallScreen={isSmallScreen}
				mermaidCode={mermaidCode}
				debouncedCode={debouncedCode}
				handleEditorChange={handleEditorChange}
				isDarkMode={isDarkMode}
				ai={{
					config: aiConfig,
					onRequestConsent: handleRequestConsent,
					onRequestFix: handleRequestFix,
				}}
			/>
			<LoadDiagramDialog />
			<AlertSnackbar
				open={!!alertMessage}
				message={alertMessage || ""}
				onClose={handleAlertClose}
			/>
			<AiAssistantFab
				currentDiagramCode={mermaidCode}
				onUpdateDiagram={handleEditorChange}
			/>
		</Box>
	);
}
