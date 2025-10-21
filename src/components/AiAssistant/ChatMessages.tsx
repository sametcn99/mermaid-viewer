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
import { useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
	messages: ChatMessage[];
	snapshots: DiagramSnapshot[];
	onRestoreSnapshot: (snapshot: DiagramSnapshot) => void;
	loading?: boolean;
	onSuggestionClick?: (text: string) => void;
}

// Component to display text with typing animation effect
function TypingText({
	content,
	isComplete = false,
	messageId,
}: {
	content: string;
	isComplete: boolean;
	messageId: string;
}) {
	// Check localStorage to see if this message has already been animated
	const storageKey = `typing-completed-${messageId}`;
	const hasBeenAnimated =
		typeof window !== "undefined" &&
		localStorage.getItem(storageKey) === "true";

	const [displayText, setDisplayText] = useState(() =>
		isComplete || hasBeenAnimated ? content : "",
	);
	const [currentIndex, setCurrentIndex] = useState(() =>
		isComplete || hasBeenAnimated ? content.length : 0,
	);
	const hasCompletedRef = useRef(isComplete || hasBeenAnimated);

	const characterDelay = 15; // milliseconds per character

	useEffect(() => {
		// If already completed once, always show full content
		if (hasCompletedRef.current || isComplete || hasBeenAnimated) {
			hasCompletedRef.current = true;
			setDisplayText(content);
			setCurrentIndex(content.length);
			return;
		}

		// Reset when content changes
		if (!content) {
			setDisplayText("");
			setCurrentIndex(0);
			return;
		}

		// Gradually reveal text character by character
		if (currentIndex < content.length) {
			const timer = setTimeout(() => {
				setDisplayText((prev) => prev + content[currentIndex]);
				setCurrentIndex((prev) => prev + 1);
			}, characterDelay);

			return () => clearTimeout(timer);
		} else if (currentIndex === content.length && currentIndex > 0) {
			// Mark as completed when animation finishes
			hasCompletedRef.current = true;
			if (typeof window !== "undefined") {
				localStorage.setItem(storageKey, "true");
			}
		}
	}, [content, currentIndex, isComplete, hasBeenAnimated, storageKey]);

	// Track if typing animation is still in progress
	const isTyping = !isComplete && currentIndex < content.length;

	return (
		<Typography
			variant="body2"
			component="div"
			sx={{
				whiteSpace: "pre-wrap",
				wordBreak: "break-word",
			}}
		>
			{displayText}
			{isTyping && (
				<Box
					component="span"
					sx={{
						display: "inline-block",
						width: "0.5em",
						height: "1em",
						verticalAlign: "text-bottom",
						borderRight: "2px solid",
						animation: "blink-caret 0.75s step-end infinite",
						"@keyframes blink-caret": {
							"from, to": { borderColor: "transparent" },
							"50%": { borderColor: "currentColor" },
						},
					}}
				/>
			)}
		</Typography>
	);
}

export default function ChatMessages({
	messages,
	snapshots,
	onRestoreSnapshot,
	loading,
	onSuggestionClick,
}: ChatMessagesProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [lastAiMessageId, setLastAiMessageId] = useState<string | null>(() => {
		// Initialize from localStorage to preserve across mounts
		if (typeof window !== "undefined") {
			return localStorage.getItem("lastAiMessageId");
		}
		return null;
	});

	// Initialize lastAiMessageId on mount if not set
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
	useEffect(() => {
		if (!lastAiMessageId && messages.length > 0) {
			const aiMessages = messages.filter((m) => m.role === "assistant");
			if (aiMessages.length > 0) {
				const newestAiMessage = aiMessages[aiMessages.length - 1];
				setLastAiMessageId(newestAiMessage.id);
				localStorage.setItem("lastAiMessageId", newestAiMessage.id);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Scroll to bottom on mount and when messages change
	// biome-ignore lint/correctness/useExhaustiveDependencies: Auto-scroll on new messages and mount
	useEffect(() => {
		// Use setTimeout to ensure DOM is ready
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);

		// Find newest AI message to animate only when a NEW message arrives
		if (messages.length > 0) {
			const aiMessages = messages.filter((m) => m.role === "assistant");
			if (aiMessages.length > 0) {
				const newestAiMessage = aiMessages[aiMessages.length - 1];
				// Only update if this is a truly new message (not on remount)
				if (newestAiMessage.id !== lastAiMessageId) {
					setLastAiMessageId(newestAiMessage.id);
					localStorage.setItem("lastAiMessageId", newestAiMessage.id);
				}
			}
		}
	}, [messages.length]); // Only depend on message count, not entire messages array

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
					const isNewestAiMessage = message.id === lastAiMessageId;

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
									isComplete={isUser || !isNewestAiMessage}
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
