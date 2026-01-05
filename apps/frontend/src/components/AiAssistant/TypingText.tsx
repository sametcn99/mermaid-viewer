import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getRawItem, setRawItem } from "@/lib/indexed-db";

export default function TypingText({
	content,
	isComplete = false,
	messageId,
}: {
	content: string;
	isComplete: boolean;
	messageId: string;
}) {
	const storageKey = `typing-completed-${messageId}`;

	const [hasBeenAnimated, setHasBeenAnimated] = useState<boolean>(isComplete);
	const [displayText, setDisplayText] = useState(() =>
		isComplete ? content : "",
	);
	const [currentIndex, setCurrentIndex] = useState(() =>
		isComplete ? content.length : 0,
	);
	const hasCompletedRef = useRef(isComplete);

	const characterDelay = 15; // milliseconds per character

	useEffect(() => {
		let isCancelled = false;

		if (isComplete) {
			setHasBeenAnimated(true);
			return;
		}

		setHasBeenAnimated(false);
		void getRawItem(storageKey)
			.then((value) => {
				if (isCancelled) return;
				setHasBeenAnimated(value === "true");
			})
			.catch((error) => {
				console.error("Failed to read typing completion flag:", error);
			});

		return () => {
			isCancelled = true;
		};
	}, [storageKey, isComplete]);

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
			setHasBeenAnimated(true);
			void setRawItem(storageKey, "true").catch((error) => {
				console.error("Failed to persist typing completion flag:", error);
			});
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
