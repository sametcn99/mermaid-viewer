"use client";

import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	type SelectChangeEvent,
} from "@mui/material";
import type { MermaidConfig } from "mermaid";
import type React from "react";
import { useEffect, useState } from "react";
import { saveMermaidConfig } from "@/lib/indexed-db/mermaid-config.storage";

export interface ExtendedMermaidConfig extends MermaidConfig {
	useCustomColors?: boolean;
}

interface DiagramSettingsProps {
	open: boolean;
	onClose: () => void;
	currentConfig: ExtendedMermaidConfig;
	onApply: (config: ExtendedMermaidConfig) => void;
}

const DiagramSettings: React.FC<DiagramSettingsProps> = ({
	open,
	onClose,
	currentConfig,
	onApply,
}) => {
	const [config, setConfig] = useState<ExtendedMermaidConfig>(currentConfig);

	useEffect(() => {
		if (open) {
			setConfig(currentConfig);
		}
	}, [open, currentConfig]);

	const handleThemeChange = (event: SelectChangeEvent<string>) => {
		setConfig({
			...config,
			theme: event.target.value as
				| "default"
				| "base"
				| "dark"
				| "forest"
				| "neutral",
		});
	};

	const handleThemeVariableChange = (key: string, value: string) => {
		setConfig({
			...config,
			themeVariables: {
				...config.themeVariables,
				[key]: value,
			},
		});
	};

	const handleFontFamilyChange = (event: SelectChangeEvent<string>) => {
		setConfig({
			...config,
			fontFamily: event.target.value,
		});
	};

	const handleUseCustomColorsChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setConfig({
			...config,
			useCustomColors: event.target.checked,
		});
	};

	const handleFontSizeChange = (event: SelectChangeEvent<string>) => {
		setConfig({
			...config,
			themeVariables: {
				...config.themeVariables,
				fontSize: event.target.value,
			},
		});
	};

	const handleFlowchartChange = (key: string, value: string | number) => {
		setConfig({
			...config,
			flowchart: {
				...config.flowchart,
				[key]: value,
			},
		});
	};

	const handleApply = () => {
		onApply(config);
		onClose();
	};

	const handleReset = () => {
		const defaultConfig: ExtendedMermaidConfig = {
			theme: "default",
			themeVariables: {},
			fontFamily: undefined,
			useCustomColors: false,
		};
		setConfig(defaultConfig);
		onApply(defaultConfig);
		saveMermaidConfig(defaultConfig);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					maxHeight: "80vh",
				},
			}}
		>
			<DialogTitle>Diagram Settings</DialogTitle>
			<DialogContent>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
					{/* Theme Selection */}
					<FormControl fullWidth>
						<InputLabel>Theme</InputLabel>
						<Select
							value={config.theme}
							label="Theme"
							onChange={handleThemeChange}
						>
							<MenuItem value="default">Default</MenuItem>
							<MenuItem value="dark">Dark</MenuItem>
							<MenuItem value="forest">Forest</MenuItem>
							<MenuItem value="neutral">Neutral</MenuItem>
							<MenuItem value="base">Base</MenuItem>
						</Select>
					</FormControl>

					{/* Font Family */}
					<FormControl fullWidth>
						<InputLabel>Font Family</InputLabel>
						<Select
							value={config.fontFamily || ""}
							label="Font Family"
							onChange={handleFontFamilyChange}
						>
							<MenuItem value="">Default</MenuItem>
							<MenuItem value="Arial, sans-serif">Arial</MenuItem>
							<MenuItem value="'Courier New', monospace">Courier New</MenuItem>
							<MenuItem value="Georgia, serif">Georgia</MenuItem>
							<MenuItem value="'Times New Roman', serif">
								Times New Roman
							</MenuItem>
							<MenuItem value="Verdana, sans-serif">Verdana</MenuItem>
							<MenuItem value="'Trebuchet MS', sans-serif">
								Trebuchet MS
							</MenuItem>
							<MenuItem value="'Comic Sans MS', cursive">
								Comic Sans MS
							</MenuItem>
							<MenuItem value="Impact, fantasy">Impact</MenuItem>
							<MenuItem value="'Lucida Console', monospace">
								Lucida Console
							</MenuItem>
							<MenuItem value="Tahoma, sans-serif">Tahoma</MenuItem>
							<MenuItem value="'Palatino Linotype', serif">Palatino</MenuItem>
							<MenuItem value="Garamond, serif">Garamond</MenuItem>
							<MenuItem value="'Segoe UI', sans-serif">Segoe UI</MenuItem>
							<MenuItem value="'Roboto', sans-serif">Roboto</MenuItem>
							<MenuItem value="'Open Sans', sans-serif">Open Sans</MenuItem>
							<MenuItem value="'Fira Code', monospace">Fira Code</MenuItem>
							<MenuItem value="'Source Code Pro', monospace">
								Source Code Pro
							</MenuItem>
						</Select>
					</FormControl>

					{/* Theme Variables */}
					<Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 2,
							}}
						>
							<InputLabel sx={{ mb: 0 }}>Custom Colors</InputLabel>
							<FormControlLabel
								control={
									<Checkbox
										checked={config.useCustomColors || false}
										onChange={handleUseCustomColorsChange}
									/>
								}
								label="Use Custom Colors"
							/>
						</Box>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: 2,
								opacity: config.useCustomColors ? 1 : 0.5,
								pointerEvents: config.useCustomColors ? "auto" : "none",
								transition: "opacity 0.2s",
							}}
						>
							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									fullWidth
									label="Primary Color"
									type="color"
									value={config.themeVariables?.primaryColor || "#1976d2"}
									onChange={(e) =>
										handleThemeVariableChange("primaryColor", e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									fullWidth
									label="Secondary Color"
									type="color"
									value={config.themeVariables?.secondaryColor || "#dc004e"}
									onChange={(e) =>
										handleThemeVariableChange("secondaryColor", e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									fullWidth
									label="Background Color"
									type="color"
									value={config.themeVariables?.mainBkg || "#ffffff"}
									onChange={(e) =>
										handleThemeVariableChange("mainBkg", e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									fullWidth
									label="Line Color"
									type="color"
									value={config.themeVariables?.lineColor || "#333333"}
									onChange={(e) =>
										handleThemeVariableChange("lineColor", e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									fullWidth
									label="Text Color"
									type="color"
									value={config.themeVariables?.textColor || "#333333"}
									onChange={(e) =>
										handleThemeVariableChange("textColor", e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<FormControl fullWidth>
									<InputLabel>Font Size</InputLabel>
									<Select
										value={config.themeVariables?.fontSize || "16px"}
										label="Font Size"
										onChange={handleFontSizeChange}
									>
										<MenuItem value="10px">10px</MenuItem>
										<MenuItem value="12px">12px</MenuItem>
										<MenuItem value="14px">14px</MenuItem>
										<MenuItem value="16px">16px</MenuItem>
										<MenuItem value="18px">18px</MenuItem>
										<MenuItem value="20px">20px</MenuItem>
										<MenuItem value="22px">22px</MenuItem>
										<MenuItem value="24px">24px</MenuItem>
										<MenuItem value="28px">28px</MenuItem>
										<MenuItem value="32px">32px</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Box>
					</Box>

					{/* Flowchart Settings */}
					<Box>
						<InputLabel sx={{ mb: 2 }}>Flowchart Settings</InputLabel>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<TextField
								fullWidth
								label="Diagram Padding"
								type="number"
								value={config.flowchart?.diagramPadding || 8}
								onChange={(e) =>
									handleFlowchartChange(
										"diagramPadding",
										Number.parseInt(e.target.value, 10),
									)
								}
								helperText="Padding around the diagram"
							/>
							<Box sx={{ display: "flex", gap: 2 }}>
								<TextField
									fullWidth
									label="Node Spacing"
									type="number"
									value={config.flowchart?.nodeSpacing || 50}
									onChange={(e) =>
										handleFlowchartChange(
											"nodeSpacing",
											Number.parseInt(e.target.value, 10),
										)
									}
									helperText="Horizontal spacing between nodes"
								/>
								<TextField
									fullWidth
									label="Rank Spacing"
									type="number"
									value={config.flowchart?.rankSpacing || 50}
									onChange={(e) =>
										handleFlowchartChange(
											"rankSpacing",
											Number.parseInt(e.target.value, 10),
										)
									}
									helperText="Vertical spacing between ranks"
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleReset} color="warning">
					Reset to Default
				</Button>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleApply} variant="contained">
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DiagramSettings;
