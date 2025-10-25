"use client";

import {
	Alert,
	Box,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { Check, Key, X } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

interface ApiKeySectionProps {
	currentApiKey?: string;
	currentModel?: string;
	onSave: (apiKey: string, model: string) => void | Promise<void>;
	onCancel: () => void;
	onTest?: (apiKey: string, model: string) => Promise<boolean>;
}

// Available Gemini models from Google AI Studio
const GEMINI_MODELS = [
	{ value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
	{ value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
	{ value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
	{ value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
	{ value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
	{ value: "gemini-flash-latest", label: "Gemini Flash (Latest)" },
	{ value: "custom", label: "Custom Model" },
];

export default function ApiKeySection({
	currentApiKey,
	currentModel,
	onSave,
	onCancel,
	onTest,
}: ApiKeySectionProps) {
	const modelSelectId = useId();
	const [apiKey, setApiKey] = useState(currentApiKey || "");
	const [model, setModel] = useState(currentModel || "gemini-2.5-flash");
	const [customModel, setCustomModel] = useState("");
	const [isCustomModel, setIsCustomModel] = useState(false);
	const [testing, setTesting] = useState(false);
	const [testResult, setTestResult] = useState<"success" | "error" | null>(
		null,
	);

	const handleTest = async () => {
		if (!apiKey.trim() || !onTest) return;

		setTesting(true);
		setTestResult(null);

		try {
			const modelToUse = isCustomModel ? customModel : model;
			const isValid = await onTest(apiKey.trim(), modelToUse);
			setTestResult(isValid ? "success" : "error");
		} catch (error) {
			console.error("API key test error:", error);
			setTestResult("error");
		} finally {
			setTesting(false);
		}
	};

	const handleSave = async () => {
		const modelToSave = isCustomModel ? customModel : model;
		await onSave(apiKey.trim(), modelToSave);
	};

	return (
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					p: 2,
					borderBottom: 1,
					borderColor: "divider",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Key size={20} />
					<Typography variant="h6" sx={{ fontSize: "1rem" }}>
						API Key Settings
					</Typography>
				</Box>
				<IconButton size="small" onClick={onCancel}>
					<X size={18} />
				</IconButton>
			</Box>

			<Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
				<Alert severity="info" sx={{ mb: 2 }}>
					When the free API limit is reached, you can use your own Gemini API
					key.
				</Alert>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					<strong>How to get an API key:</strong>
				</Typography>
				<Typography variant="body2" component="ol" sx={{ pl: 2, mb: 3 }}>
					<li>
						Go to{" "}
						<Link
							href="https://ai.google.dev/"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								color: "#1976d2",
								textDecoration: "underline",
							}}
						>
							Google AI Studio
						</Link>
					</li>
					<li>Click the "Get API Key" button</li>
					<li>Create a new API key</li>
					<li>Paste the key in the field below</li>
				</Typography>

				<TextField
					fullWidth
					label="Gemini API Key"
					placeholder="AIza..."
					value={apiKey}
					onChange={(e) => {
						setApiKey(e.target.value);
						setTestResult(null);
					}}
					type="password"
					size="small"
					sx={{ mb: 2 }}
					helperText="Your API key is stored only on this device and never sent to the server"
				/>

				<FormControl fullWidth size="small" sx={{ mb: 2 }}>
					<InputLabel id={modelSelectId}>Model</InputLabel>
					<Select
						labelId={modelSelectId}
						value={model}
						label="Model"
						onChange={(e) => {
							const value = e.target.value;
							setModel(value);
							setIsCustomModel(value === "custom");
							setTestResult(null);
						}}
					>
						{GEMINI_MODELS.map((modelOption) => (
							<MenuItem key={modelOption.value} value={modelOption.value}>
								{modelOption.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{isCustomModel && (
					<TextField
						fullWidth
						label="Custom Model Name"
						placeholder="e.g., gemini-exp-1206"
						value={customModel}
						onChange={(e) => {
							setCustomModel(e.target.value);
							setTestResult(null);
						}}
						size="small"
						sx={{ mb: 2 }}
						helperText="Enter the exact model name from Google AI Studio"
					/>
				)}

				{testResult === "success" && (
					<Alert severity="success" sx={{ mb: 2 }}>
						API key is valid!
					</Alert>
				)}

				{testResult === "error" && (
					<Alert severity="error" sx={{ mb: 2 }}>
						API key is invalid. Please check.
					</Alert>
				)}

				{onTest && (
					<Button
						fullWidth
						variant="outlined"
						onClick={handleTest}
						disabled={
							!apiKey.trim() ||
							testing ||
							(isCustomModel && !customModel.trim())
						}
						sx={{ mb: 2 }}
					>
						{testing ? "Testing..." : "Test API Key"}
					</Button>
				)}
			</Box>

			<Box
				sx={{
					p: 2,
					borderTop: 1,
					borderColor: "divider",
					display: "flex",
					gap: 1,
				}}
			>
				<Button fullWidth variant="outlined" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					fullWidth
					variant="contained"
					onClick={() => {
						void handleSave();
					}}
					disabled={!apiKey.trim() || (isCustomModel && !customModel.trim())}
					startIcon={<Check size={18} />}
					sx={{
						borderRadius: 28,
						py: 1,
						boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.2)",
						"&:hover": {
							boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.3)",
						},
					}}
				>
					Save
				</Button>
			</Box>
		</Box>
	);
}
