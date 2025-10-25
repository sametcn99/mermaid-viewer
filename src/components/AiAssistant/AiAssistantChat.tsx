"use client";

import type {
	AiAssistantConfig,
	ChatMessage,
	DiagramSnapshot,
} from "@/types/ai-assistant.types";
import {
	addMessageToAiChatHistory,
	clearAiChatHistory,
	clearDiagramSnapshots,
	getAiChatHistory,
	saveDiagramSnapshots,
} from "@/lib/utils/local-storage/ai-assistant.storage";
import {
	Alert,
	Box,
	Dialog,
	IconButton,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Key, Minus, Send, Sparkles, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ApiKeySection from "./ApiKeySection";
import ChatMessages from "./ChatMessages";

interface AiAssistantChatProps {
	open: boolean;
	minimized: boolean;
	config: AiAssistantConfig;
	currentDiagramCode: string;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onUpdateDiagram: (code: string) => void;
	onUpdateConfig: (config: AiAssistantConfig) => void;
}

export default function AiAssistantChat({
	open,
	minimized,
	config,
	currentDiagramCode,
	onClose,
	onMinimize,
	onMaximize,
	onUpdateDiagram,
	onUpdateConfig,
}: AiAssistantChatProps) {
	const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [snapshots, setSnapshots] = useState<DiagramSnapshot[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load chat history on mount
	useEffect(() => {
		const history = getAiChatHistory();
		if (history) {
			setMessages(history.messages);
		}
	}, []);

	const handleSendMessage = useCallback(async () => {
		if (!inputValue.trim() || loading) return;

		const userMessage: ChatMessage = {
			id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
			role: "user",
			content: inputValue.trim(),
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, userMessage]);
		addMessageToAiChatHistory(userMessage);
		setInputValue("");
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/gemini", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: inputValue.trim(),
					currentDiagramCode,
					chatHistory: messages.slice(-6), // Last 6 messages for context
					userApiKey: config.userApiKey,
					selectedModel: config.selectedModel,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.needsApiKey) {
					setError(data.error);
					setApiKeyDialogOpen(true);
				} else {
					throw new Error(data.error || "Failed to get response");
				}
				return;
			}

			const assistantMessage: ChatMessage = {
				id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
				role: "assistant",
				content: data.response,
				diagramCode: data.mermaidCode,
				timestamp: Date.now(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
			addMessageToAiChatHistory(assistantMessage);

			// If AI provided mermaid code, create snapshot and update diagram
			if (data.mermaidCode) {
				const snapshot: DiagramSnapshot = {
					code: currentDiagramCode,
					timestamp: Date.now(),
					messageId: assistantMessage.id,
				};

				const newSnapshots = [...snapshots, snapshot];
				setSnapshots(newSnapshots);
				saveDiagramSnapshots(newSnapshots);

				// Auto-update diagram
				onUpdateDiagram(data.mermaidCode);
			}
		} catch (err) {
			console.error("Error sending message:", err);
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	}, [
		inputValue,
		loading,
		currentDiagramCode,
		messages,
		config.userApiKey,
		config.selectedModel,
		snapshots,
		onUpdateDiagram,
	]);

	const handleRestoreSnapshot = useCallback(
		(snapshot: DiagramSnapshot) => {
			onUpdateDiagram(snapshot.code);
		},
		[onUpdateDiagram],
	);

	const handleSaveApiKey = useCallback(
		(apiKey: string, model: string) => {
			const newConfig = {
				...config,
				userApiKey: apiKey,
				selectedModel: model,
			};
			onUpdateConfig(newConfig);
			// Notify other components about the config change
			window.dispatchEvent(new CustomEvent("aiConfigChanged"));
			setApiKeyDialogOpen(false);
			setError(null);
		},
		[config, onUpdateConfig],
	);

	const handleTestApiKey = useCallback(
		async (apiKey: string, model: string): Promise<boolean> => {
			try {
				const response = await fetch("/api/gemini", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: "Test",
						currentDiagramCode: "",
						chatHistory: [],
						userApiKey: apiKey,
						selectedModel: model,
					}),
				});

				return response.ok;
			} catch (error) {
				console.error("API key test error:", error);
				return false;
			}
		},
		[],
	);

	const handleClearHistory = useCallback(() => {
		if (confirm("Are you sure you want to clear all chat history?")) {
			setMessages([]);
			setSnapshots([]);
			clearAiChatHistory();
			clearDiagramSnapshots();
		}
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage],
	);

	if (!open) return null;

	if (minimized) {
		return (
			<Paper
				elevation={3}
				sx={{
					position: "fixed",
					bottom: { xs: 16, sm: 20 },
					right: { xs: 16, sm: 20 },
					width: { xs: 260, sm: 300 },
					zIndex: 1200,
					borderRadius: 2,
					overflow: "hidden",
					boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.01)",
					transition: "transform 0.2s",
					"&:hover": { transform: "translateY(-3px)" },
				}}
			>
				<Box
					sx={{
						p: 1.5,
						borderRadius: 2,
						border: (theme) => `1px solid ${theme.palette.divider}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						cursor: "pointer",
					}}
					onClick={onMaximize}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Sparkles size={18} />
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
							AI Assistant
						</Typography>
					</Box>
					<Box sx={{ display: "flex", gap: 0.5 }}>
						<IconButton
							size="small"
							sx={{
								color: "inherit",
								transition: "transform 0.2s",
								"&:hover": { transform: "scale(1.1)" },
							}}
							onClick={(e) => {
								e.stopPropagation();
								onClose();
							}}
						>
							<X size={16} />
						</IconButton>
					</Box>
				</Box>
			</Paper>
		);
	}

	return (
		<>
			<Paper
				elevation={4}
				sx={{
					position: "fixed",
					bottom: { xs: 16, sm: 20 },
					right: { xs: 16, sm: 20 },
					width: { xs: "calc(100vw - 32px)", sm: 400 },
					maxWidth: 400,
					height: { xs: "calc(100vh - 100px)", sm: 600 },
					maxHeight: { xs: "calc(100vh - 100px)", sm: 600 },
					zIndex: 1200,
					borderRadius: 3,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					boxShadow: "0px 8px 24px rgba(255, 255, 255, 0.03)",
					transition: "all 0.3s ease",
					border: (theme) => `1px solid ${theme.palette.divider}`,
				}}
			>
				{/* Header */}
				<Box
					sx={{
						p: 1.5,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
						borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Sparkles size={20} />
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							AI Assistant
						</Typography>
					</Box>
					<Box sx={{ display: "flex", gap: 0.5 }}>
						<Tooltip title="Clear History">
							<IconButton
								size="small"
								sx={{
									color: "inherit",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.1)" },
								}}
								onClick={handleClearHistory}
							>
								<Trash2 size={16} />
							</IconButton>
						</Tooltip>
						<Tooltip title="API Key">
							<IconButton
								size="small"
								sx={{
									color: "inherit",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.1)" },
								}}
								onClick={() => setApiKeyDialogOpen(true)}
							>
								<Key size={16} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Minimize">
							<IconButton
								size="small"
								sx={{
									color: "inherit",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.1)" },
								}}
								onClick={onMinimize}
							>
								<Minus size={16} />
							</IconButton>
						</Tooltip>
						<Tooltip title="Close">
							<IconButton
								size="small"
								sx={{
									color: "inherit",
									transition: "transform 0.2s",
									"&:hover": { transform: "scale(1.1)" },
								}}
								onClick={onClose}
							>
								<X size={16} />
							</IconButton>
						</Tooltip>
					</Box>
				</Box>

				{/* Content */}
				<ChatMessages
					messages={messages}
					snapshots={snapshots}
					onRestoreSnapshot={handleRestoreSnapshot}
					loading={loading}
					onSuggestionClick={setInputValue}
				/>

				{error && (
					<Alert
						severity="error"
						sx={{
							mx: 2,
							mb: 1,
							borderRadius: 2,
							boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
						}}
					>
						{error}
					</Alert>
				)}

				{/* Input */}
				<Box
					sx={{
						p: 2,
						borderTop: 1,
						borderColor: "divider",
						display: "flex",
						gap: 1,
						boxShadow: "0px -2px 8px rgba(0,0,0,0.05)",
					}}
				>
					<TextField
						fullWidth
						size="small"
						placeholder="Ask something about Mermaid diagrams..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={loading}
						multiline
						maxRows={3}
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 3,
								"&.Mui-focused": {
									boxShadow: "0px 0px 6px rgba(25, 118, 210, 0.3)",
								},
							},
						}}
					/>
					<IconButton
						color="primary"
						onClick={handleSendMessage}
						disabled={!inputValue.trim() || loading}
						sx={{
							bgcolor:
								inputValue.trim() && !loading
									? "primary.main"
									: "action.disabledBackground",
							color:
								inputValue.trim() && !loading
									? "primary.contrastText"
									: "action.disabled",
							"&:hover": {
								bgcolor:
									inputValue.trim() && !loading
										? "primary.dark"
										: "action.disabledBackground",
							},
							borderRadius: 2,
							transition: "all 0.2s",
							height: 40,
							width: 40,
						}}
					>
						<Send size={18} />
					</IconButton>
				</Box>
			</Paper>

			{/* API Key Dialog */}
			<Dialog
				open={apiKeyDialogOpen}
				onClose={() => setApiKeyDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3,
						boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
					},
				}}
			>
				<ApiKeySection
					currentApiKey={config.userApiKey}
					currentModel={config.selectedModel}
					onSave={handleSaveApiKey}
					onCancel={() => setApiKeyDialogOpen(false)}
					onTest={handleTestApiKey}
				/>
			</Dialog>
		</>
	);
}
