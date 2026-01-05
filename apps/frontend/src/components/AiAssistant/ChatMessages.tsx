"use client";

import type { ChatMessage, DiagramSnapshot } from "@/types/ai-assistant.types";
import {
	Box,
	Button,
	Chip,
	List,
	ListItem,
	Paper,
	Typography,
} from "@mui/material";
import { RotateCcw, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRawItem, setRawItem } from "@/lib/indexed-db";
import TypingText from "./TypingText";

const LAST_AI_MESSAGE_KEY = "lastAiMessageId";

interface ChatMessagesProps {
	messages: ChatMessage[];
	snapshots: DiagramSnapshot[];
	onRestoreSnapshot: (snapshot: DiagramSnapshot) => void;
	loading?: boolean;
	onSuggestionClick?: (text: string) => void;
}

export default function ChatMessages({
	messages,
	snapshots,
	onRestoreSnapshot,
	loading,
	onSuggestionClick,
}: ChatMessagesProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [lastAiMessageId, setLastAiMessageId] = useState<string | null>(null);
	const [isLastAiMessageIdLoaded, setIsLastAiMessageIdLoaded] = useState(false);

	const persistLastAiMessageId = useCallback((id: string) => {
		setLastAiMessageId(id);
		void setRawItem(LAST_AI_MESSAGE_KEY, id).catch((error) => {
			console.error("Failed to store last AI message id:", error);
		});
	}, []);

	useEffect(() => {
		let isCancelled = false;

		const loadStoredLastAiMessageId = async () => {
			try {
				const storedValue = await getRawItem(LAST_AI_MESSAGE_KEY);
				if (!isCancelled) {
					setLastAiMessageId(storedValue);
				}
			} catch (error) {
				console.error("Failed to read last AI message id:", error);
			} finally {
				if (!isCancelled) {
					setIsLastAiMessageIdLoaded(true);
				}
			}
		};

		void loadStoredLastAiMessageId();

		return () => {
			isCancelled = true;
		};
	}, []);

	// Compute the newest assistant message id synchronously from the messages array.
	// This lets us decide during the first render whether the newest AI message
	// is "new" (different from lastAiMessageId) and should animate.
	const derivedNewestAiMessageId: string | null = (() => {
		const aiMessages = messages.filter((m) => m.role === "assistant");
		if (aiMessages.length === 0) return null;
		return aiMessages[aiMessages.length - 1].id;
	})();

	useEffect(() => {
		if (!isLastAiMessageIdLoaded) return;
		if (lastAiMessageId) return;
		if (messages.length === 0) return;

		const aiMessages = messages.filter((m) => m.role === "assistant");
		if (aiMessages.length === 0) return;

		const newestAiMessage = aiMessages[aiMessages.length - 1];
		persistLastAiMessageId(newestAiMessage.id);
	}, [
		isLastAiMessageIdLoaded,
		lastAiMessageId,
		messages,
		persistLastAiMessageId,
	]);

	// Scroll to bottom on mount and when messages change
	useEffect(() => {
		const scrollTimeout = window.setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);

		if (
			!isLastAiMessageIdLoaded ||
			!derivedNewestAiMessageId ||
			derivedNewestAiMessageId === lastAiMessageId
		) {
			return () => {
				window.clearTimeout(scrollTimeout);
			};
		}

		let isCancelled = false;
		const storageKey = `typing-completed-${derivedNewestAiMessageId}`;

		const checkTypingCompletion = async () => {
			try {
				const storedFlag = await getRawItem(storageKey);
				if (!isCancelled && storedFlag === "true") {
					persistLastAiMessageId(derivedNewestAiMessageId);
					return true;
				}
			} catch (error) {
				console.error("Failed to read typing completion flag:", error);
			}
			return false;
		};

		void checkTypingCompletion();

		const interval = window.setInterval(() => {
			void checkTypingCompletion().then((completed) => {
				if (completed) {
					window.clearInterval(interval);
					window.clearTimeout(timeoutId);
				}
			});
		}, 100);

		const timeoutId = window.setTimeout(() => {
			window.clearInterval(interval);
		}, 10000);

		return () => {
			isCancelled = true;
			window.clearInterval(interval);
			window.clearTimeout(timeoutId);
			window.clearTimeout(scrollTimeout);
		};
	}, [
		derivedNewestAiMessageId,
		lastAiMessageId,
		isLastAiMessageIdLoaded,
		persistLastAiMessageId,
	]);

	// Scroll to bottom when loading state changes
	useEffect(() => {
		if (loading) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 100);
		}
	}, [loading]);

	const getSnapshotForMessage = (
		messageId: string,
	): DiagramSnapshot | undefined => {
		return snapshots.find((snapshot) => snapshot.messageId === messageId);
	};

	return (
		<Box
			sx={{
				flex: 1,
				overflow: "auto",
				p: 2,
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			{messages.length === 0 && !loading && (
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						color: "text.secondary",
						gap: 2,
						py: 4,
					}}
				>
					<Sparkles size={48} opacity={0.6} />
					<Typography variant="body1" fontWeight="medium">
						Hello! I can help you create and edit Mermaid diagrams.
					</Typography>
					<Box
						sx={{
							maxWidth: "80%",
							display: "flex",
							flexDirection: "column",
							gap: 1,
						}}
					>
						<Typography variant="body2" color="text.secondary">
							Try asking:
						</Typography>
						<Box
							sx={{
								display: "flex",
								gap: 1,
								flexWrap: "wrap",
								justifyContent: "center",
							}}
						>
							<Chip
								label="Create a simple flowchart"
								size="small"
								clickable
								onClick={() => onSuggestionClick?.("Create a simple flowchart")}
								sx={{
									cursor: "pointer",
									"&:hover": {
										backgroundColor: "primary.light",
										color: "primary.contrastText",
									},
								}}
							/>
							<Chip
								label="Add a new step to this diagram"
								size="small"
								clickable
								onClick={() =>
									onSuggestionClick?.("Add a new step to this diagram")
								}
								sx={{
									cursor: "pointer",
									"&:hover": {
										backgroundColor: "primary.light",
										color: "primary.contrastText",
									},
								}}
							/>
						</Box>
					</Box>
				</Box>
			)}

			<List sx={{ p: 0 }}>
				{messages.map((message) => {
					const snapshot = getSnapshotForMessage(message.id);
					const isUser = message.role === "user";
					// Only animate typing when this message is the newest assistant message
					// in the current messages array and it's different from the last
					// stored assistant message id (i.e. it's truly new).
					const shouldAnimateTyping =
						!isUser &&
						derivedNewestAiMessageId !== null &&
						isLastAiMessageIdLoaded &&
						derivedNewestAiMessageId !== lastAiMessageId &&
						message.id === derivedNewestAiMessageId;

					return (
						<ListItem
							key={message.id}
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: isUser ? "flex-end" : "flex-start",
								gap: 1,
								p: 1,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									mb: 0.5,
								}}
							>
								{isUser ? (
									<>
										<Typography variant="caption" color="text.secondary">
											You
										</Typography>
										<User size={14} />
									</>
								) : (
									<>
										<Typography variant="caption" color="text.secondary">
											AI Assistant
										</Typography>
										<Chip
											label="AI"
											size="small"
											sx={{ height: 16, fontSize: "0.65rem" }}
										/>
									</>
								)}
							</Box>

							<Paper
								elevation={isUser ? 1 : 1}
								sx={{
									p: 1.5,
									maxWidth: "85%",
									bgcolor: isUser ? "primary.main" : "background.paper",
									color: isUser ? "primary.contrastText" : "text.primary",
									borderRadius: isUser
										? "16px 16px 4px 16px"
										: "16px 16px 16px 4px",
									border: isUser ? "none" : 1,
									borderColor: isUser ? "transparent" : "divider",
									boxShadow: isUser
										? "0px 2px 8px rgba(0,0,0,0.15)"
										: "0px 1px 3px rgba(0,0,0,0.08)",
								}}
							>
								<TypingText
									content={message.content}
									// If user message or not the (new) newest AI message,
									// consider it complete immediately. Otherwise allow
									// the typing animation to run.
									isComplete={isUser || !shouldAnimateTyping}
									messageId={message.id}
								/>{" "}
								{message.diagramCode && (
									<Box
										sx={{
											mt: 1,
											p: 1,
											bgcolor: isUser ? "rgba(0,0,0,0.1)" : "background.paper",
											borderRadius: 1,
											fontSize: "0.75rem",
											fontFamily: "monospace",
											overflow: "auto",
											maxHeight: "200px",
										}}
									>
										<code>{message.diagramCode}</code>
									</Box>
								)}
								{snapshot && !isUser && (
									<Button
										size="small"
										startIcon={<RotateCcw size={14} />}
										onClick={() => onRestoreSnapshot(snapshot)}
										sx={{
											mt: 1,
											fontSize: "0.7rem",
											textTransform: "none",
										}}
									>
										Restore to last checkpoint
									</Button>
								)}
							</Paper>

							<Typography
								variant="caption"
								color="text.disabled"
								sx={{ fontSize: "0.65rem" }}
							>
								{new Date(message.timestamp).toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</Typography>
						</ListItem>
					);
				})}
			</List>

			{loading && (
				<ListItem
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: 1,
						p: 1,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.5,
							mb: 0.5,
						}}
					>
						<Typography variant="caption" color="text.secondary">
							AI Assistant
						</Typography>
						<Chip
							label="AI"
							size="small"
							sx={{ height: 16, fontSize: "0.65rem" }}
						/>
					</Box>
					<Paper
						elevation={1}
						sx={{
							p: 2,
							maxWidth: "85%",
							bgcolor: "background.paper",
							borderRadius: "16px 16px 16px 4px",
							border: 1,
							borderColor: "divider",
							boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
							display: "flex",
							alignItems: "center",
							minWidth: 100,
						}}
					>
						<Box
							component="span"
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
							}}
						>
							<Box
								component="span"
								className="typing-dot"
								sx={{
									width: 8,
									height: 8,
									bgcolor: "primary.main",
									borderRadius: "50%",
									animation: "typing-dot 1.4s infinite ease-in-out both",
									animationDelay: "0s",
									"@keyframes typing-dot": {
										"0%, 80%, 100%": {
											transform: "scale(0.6)",
											opacity: 0.6,
										},
										"40%": {
											transform: "scale(1)",
											opacity: 1,
										},
									},
								}}
							/>
							<Box
								component="span"
								className="typing-dot"
								sx={{
									width: 8,
									height: 8,
									bgcolor: "primary.main",
									borderRadius: "50%",
									animation: "typing-dot 1.4s infinite ease-in-out both",
									animationDelay: "0.2s",
								}}
							/>
							<Box
								component="span"
								className="typing-dot"
								sx={{
									width: 8,
									height: 8,
									bgcolor: "primary.main",
									borderRadius: "50%",
									animation: "typing-dot 1.4s infinite ease-in-out both",
									animationDelay: "0.4s",
								}}
							/>
						</Box>
					</Paper>
					<Typography
						variant="caption"
						color="text.disabled"
						sx={{ fontSize: "0.65rem" }}
					>
						Typing...
					</Typography>
				</ListItem>
			)}

			<div ref={messagesEndRef} />
		</Box>
	);
}
