import { GoogleGenAI } from "@google/genai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			message,
			currentDiagramCode,
			chatHistory,
			userApiKey,
			selectedModel,
		} = body;

		if (!message || typeof message !== "string") {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

		// Use user API key if provided, otherwise use server API key
		const apiKey = userApiKey || process.env.GEMINI_API_KEY;
		// Use selected model or default to gemini-2.0-flash-exp
		const model = selectedModel || "gemini-2.0-flash-exp";

		if (!apiKey) {
			return NextResponse.json(
				{
					error: "API key is required. Please provide your own Gemini API key.",
					needsApiKey: true,
				},
				{ status: 401 },
			);
		}

		// Initialize Gemini AI
		const genAI = new GoogleGenAI({ apiKey });

		// Build context-aware prompt
		const systemPrompt = `You are an expert in Mermaid diagram syntax. Your role is to help users create and modify Mermaid diagrams.

Rules:
1. Always respond with valid Mermaid syntax
2. Wrap your Mermaid code in markdown code blocks with 'mermaid' language identifier
3. Provide brief explanations before or after the code
4. When modifying existing diagrams, preserve the structure and only make requested changes
5. Support all Mermaid diagram types: flowchart, sequence, class, state, ER, gantt, pie, git graph, mindmap, timeline, etc.

Current diagram code:
${currentDiagramCode ? `\`\`\`mermaid\n${currentDiagramCode}\n\`\`\`` : "No diagram loaded"}

User request: ${message}`;

		// Build chat history for context
		const contents = chatHistory?.length
			? [
					...chatHistory.map((msg: { role: string; content: string }) => ({
						role: msg.role === "user" ? "user" : "model",
						parts: [{ text: msg.content }],
					})),
					{
						role: "user",
						parts: [{ text: systemPrompt }],
					},
				]
			: systemPrompt;

		// Send message and get response
		const response = await genAI.models.generateContent({
			model,
			contents,
		});

		const responseText = response.text;

		// Extract mermaid code from response
		const mermaidCodeMatch = responseText?.match(/```mermaid\n([\s\S]*?)\n```/);
		const mermaidCode = mermaidCodeMatch ? mermaidCodeMatch[1] : null;

		return NextResponse.json({
			response: responseText || "",
			mermaidCode,
			success: true,
		});
	} catch (error) {
		console.error("Gemini API error:", error);

		// Check if it's an API key error
		if (error instanceof Error) {
			if (
				error.message.includes("API_KEY_INVALID") ||
				error.message.includes("API key")
			) {
				return NextResponse.json(
					{
						error: "Invalid API key. Please check your Gemini API key.",
						needsApiKey: true,
					},
					{ status: 401 },
				);
			}

			if (error.message.includes("quota") || error.message.includes("limit")) {
				return NextResponse.json(
					{
						error:
							"API quota exceeded. Please use your own API key to continue.",
						needsApiKey: true,
					},
					{ status: 429 },
				);
			}
		}

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to generate response",
			},
			{ status: 500 },
		);
	}
}
