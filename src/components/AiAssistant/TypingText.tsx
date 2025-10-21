import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function TypingText({
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
