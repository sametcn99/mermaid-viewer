"use client";

import { useState } from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Container,
	Box,
} from "@mui/material";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
	const [expanded, setExpanded] = useState<number | false>(false);

	const faqs = [
		{
			question: "Is Mermaid Editor free to use?",
			answer:
				"Yes, the core editor is completely free and open source. You can create, save (locally), and export diagrams without any cost.",
		},
		{
			question: "Do I need to sign up?",
			answer:
				"No, you can start creating diagrams immediately using local storage. However, signing in with GitHub or Google allows you to sync your diagrams across devices for free.",
		},
		{
			question: "How does the AI Assistant work?",
			answer:
				"The AI Assistant helps you generate Mermaid syntax using Google's Gemini AI. You can use it for free with our provided key, or optionally provide your own Gemini API key for higher limits.",
		},
		{
			question: "Can I use this for commercial projects?",
			answer:
				"Yes, the diagrams you create are yours. The editor itself is open source under GPL-3.0.",
		},
		{
			question: "Can I use the editor offline?",
			answer:
				"Yes! All your diagrams and settings are saved locally in your browser by default. You can work completely offline without an internet connection.",
		},
		{
			question: "How do I share my diagrams?",
			answer:
				"You can share diagrams by copying the URL (which contains the diagram code) or by using the 'Embed as iframe' feature to add it to your website. You can also export as PNG/SVG.",
		},
	];

	return (
		<Container maxWidth="md" sx={{ py: 10 }}>
			<Typography variant="h3" textAlign="center" fontWeight="bold" mb={6}>
				Frequently Asked Questions
			</Typography>
			<Box>
				{faqs.map((faq, index) => (
					<Accordion
						key={index}
						elevation={0}
						expanded={expanded === index}
						onChange={(_e, isExpanded) =>
							setExpanded(isExpanded ? index : false)
						}
						sx={{
							bgcolor: "transparent",
							mb: 2,
							"&:before": { display: "none" },
						}}
					>
						<AccordionSummary
							expandIcon={<ChevronDown />}
							sx={{ fontWeight: "bold" }}
						>
							{faq.question}
						</AccordionSummary>
						<AccordionDetails>
							<Typography color="text.secondary">{faq.answer}</Typography>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Container>
	);
}
