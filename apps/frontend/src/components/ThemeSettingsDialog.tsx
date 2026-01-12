"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Divider,
	Collapse,
	Stack,
	IconButton,
	Tooltip,
	Switch,
	Paper,
	alpha,
} from "@mui/material";
import { Monitor, Sun, Moon, Palette, RotateCcw, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useThemeSettings } from "./ThemeRegistry";
import {
	defaultCustomColors,
	type CustomThemeColors,
	type ThemeMode,
} from "@/lib/theme";

interface ThemeSettingsDialogProps {
	open: boolean;
	onClose: () => void;
}

// Color picker component
interface ColorPickerProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				py: 1,
			}}
		>
			<Typography variant="body2">{label}</Typography>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Typography
					variant="caption"
					sx={{ fontFamily: "monospace", color: "text.secondary" }}
				>
					{value.toUpperCase()}
				</Typography>
				<Box
					component="input"
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					sx={{
						width: 36,
						height: 36,
						border: "2px solid",
						borderColor: "divider",
						borderRadius: 1,
						cursor: "pointer",
						padding: 0,
						backgroundColor: "transparent",
						"&::-webkit-color-swatch-wrapper": {
							padding: 0,
						},
						"&::-webkit-color-swatch": {
							border: "none",
							borderRadius: 0.5,
						},
					}}
				/>
			</Box>
		</Box>
	);
}

// Theme preview component
interface ThemePreviewProps {
	colors: CustomThemeColors;
}

function ThemePreview({ colors }: ThemePreviewProps) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 2,
				borderRadius: 2,
				border: "1px solid",
				borderColor: "divider",
				backgroundColor: colors.background,
			}}
		>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 600,
					mb: 1,
					display: "block",
					color: colors.textSecondary,
				}}
			>
				Preview
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: 1,
					flexWrap: "wrap",
				}}
			>
				<Box
					sx={{
						width: 48,
						height: 32,
						borderRadius: 1,
						backgroundColor: colors.primary,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography
						variant="caption"
						sx={{
							fontSize: "0.65rem",
							color: colors.mode === "dark" ? colors.background : "#fff",
						}}
					>
						Primary
					</Typography>
				</Box>
				<Box
					sx={{
						width: 48,
						height: 32,
						borderRadius: 1,
						backgroundColor: colors.secondary,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography
						variant="caption"
						sx={{
							fontSize: "0.65rem",
							color: colors.mode === "dark" ? colors.background : "#fff",
						}}
					>
						Secondary
					</Typography>
				</Box>
				<Box
					sx={{
						width: 48,
						height: 32,
						borderRadius: 1,
						backgroundColor: colors.paper,
						border: `1px solid ${colors.divider}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography
						variant="caption"
						sx={{ fontSize: "0.65rem", color: colors.textPrimary }}
					>
						Paper
					</Typography>
				</Box>
			</Box>
			<Box sx={{ mt: 1 }}>
				<Typography
					variant="caption"
					sx={{ color: colors.textPrimary, display: "block" }}
				>
					Primary Text
				</Typography>
				<Typography
					variant="caption"
					sx={{ color: colors.textSecondary, display: "block" }}
				>
					Secondary Text
				</Typography>
			</Box>
		</Paper>
	);
}

export default function ThemeSettingsDialog({
	open,
	onClose,
}: ThemeSettingsDialogProps) {
	const { track } = useAnalytics();
	const {
		themeMode,
		customColors,
		setThemeMode,
		setCustomColors,
		resetCustomColors,
	} = useThemeSettings();

	const [localColors, setLocalColors] =
		useState<CustomThemeColors>(customColors);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	// Sync local colors with context when dialog opens
	useEffect(() => {
		if (open) {
			setLocalColors(customColors);
			track("theme_settings_opened");
		}
	}, [open, customColors, track]);

	const handleThemeModeChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newMode = event.target.value as ThemeMode;
			setThemeMode(newMode);
			track("theme_mode_changed", { mode: newMode });
		},
		[setThemeMode, track],
	);

	const handleColorChange = useCallback(
		(key: keyof CustomThemeColors) => (value: string) => {
			const newColors = { ...localColors, [key]: value };
			setLocalColors(newColors);
		},
		[localColors],
	);

	const handleBaseModeChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newMode = event.target.checked ? "dark" : "light";
			const newColors = { ...localColors, mode: newMode } as CustomThemeColors;
			setLocalColors(newColors);
			track("theme_base_mode_changed", { mode: newMode });
		},
		[localColors, track],
	);

	const handleResetColors = useCallback(() => {
		setLocalColors(defaultCustomColors);
		track("theme_colors_reset");
	}, [track]);

	const handleApplyCustomColors = useCallback(() => {
		setCustomColors(localColors);
		track("theme_custom_colors_applied");
	}, [localColors, setCustomColors, track]);

	const isCustomMode = themeMode === "custom";
	const hasChanges =
		JSON.stringify(localColors) !== JSON.stringify(customColors);

	const handleClose = useCallback(() => {
		if (isCustomMode && hasChanges) {
			setShowConfirmDialog(true);
		} else {
			onClose();
		}
	}, [isCustomMode, hasChanges, onClose]);

	const handleDiscard = useCallback(() => {
		setShowConfirmDialog(false);
		onClose();
	}, [onClose]);

	const handleConfirmApply = useCallback(() => {
		handleApplyCustomColors();
		setShowConfirmDialog(false);
		onClose();
	}, [handleApplyCustomColors, onClose]);

	const themeModeOptions = [
		{
			value: "default" as ThemeMode,
			label: "Device Default",
			description: "Follows your system preference",
			icon: <Monitor size={20} />,
		},
		{
			value: "light" as ThemeMode,
			label: "Light",
			description: "Light theme",
			icon: <Sun size={20} />,
		},
		{
			value: "dark" as ThemeMode,
			label: "Dark",
			description: "Dark theme",
			icon: <Moon size={20} />,
		},
		{
			value: "custom" as ThemeMode,
			label: "Custom",
			description: "Create your own theme",
			icon: <Palette size={20} />,
		},
	];

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 3,
						maxHeight: "80vh",
					},
				}}
			>
				<DialogTitle
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						pb: 1,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Palette size={24} />
						<Typography variant="h6" fontWeight={600}>
							Theme Settings
						</Typography>
					</Box>
					<IconButton onClick={handleClose} size="small" aria-label="Close">
						<X size={20} />
					</IconButton>
				</DialogTitle>

				<DialogContent dividers>
					<Stack spacing={3}>
						{/* Theme Mode Selection */}
						<Box>
							<Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
								Theme Mode
							</Typography>
							<FormControl component="fieldset" fullWidth>
								<RadioGroup value={themeMode} onChange={handleThemeModeChange}>
									{themeModeOptions.map((option) => (
										<Paper
											key={option.value}
											elevation={0}
											sx={{
												mb: 1,
												border: "1px solid",
												borderColor:
													themeMode === option.value
														? "primary.main"
														: "divider",
												borderRadius: 2,
												overflow: "hidden",
												transition: "all 0.2s ease",
												backgroundColor:
													themeMode === option.value
														? (theme) => alpha(theme.palette.primary.main, 0.08)
														: "transparent",
											}}
										>
											<FormControlLabel
												value={option.value}
												control={<Radio sx={{ ml: 1 }} />}
												label={
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 1.5,
															py: 0.5,
														}}
													>
														<Box
															sx={{
																color:
																	themeMode === option.value
																		? "primary.main"
																		: "text.secondary",
															}}
														>
															{option.icon}
														</Box>
														<Box>
															<Typography variant="body2" fontWeight={500}>
																{option.label}
															</Typography>
															<Typography
																variant="caption"
																color="text.secondary"
															>
																{option.description}
															</Typography>
														</Box>
													</Box>
												}
												sx={{
													m: 0,
													width: "100%",
													py: 1,
													px: 0.5,
												}}
											/>
										</Paper>
									))}
								</RadioGroup>
							</FormControl>
						</Box>

						{/* Custom Theme Colors - Only visible when custom mode is selected */}
						<Collapse in={isCustomMode}>
							<Box>
								<Divider sx={{ mb: 2 }} />
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										mb: 2,
									}}
								>
									<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
										Custom Colors
									</Typography>
									<Tooltip title="Reset to defaults">
										<IconButton
											size="small"
											onClick={handleResetColors}
											aria-label="Reset colors"
										>
											<RotateCcw size={18} />
										</IconButton>
									</Tooltip>
								</Box>

								{/* Base Mode Toggle */}
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										mb: 2,
										p: 1.5,
										borderRadius: 2,
										backgroundColor: (theme) =>
											alpha(theme.palette.divider, 0.1),
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Sun size={18} />
										<Typography variant="body2">Base Mode</Typography>
									</Box>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Typography
											variant="caption"
											color={
												localColors.mode === "light"
													? "primary"
													: "text.secondary"
											}
										>
											Light
										</Typography>
										<Switch
											checked={localColors.mode === "dark"}
											onChange={handleBaseModeChange}
											size="small"
										/>
										<Typography
											variant="caption"
											color={
												localColors.mode === "dark"
													? "primary"
													: "text.secondary"
											}
										>
											Dark
										</Typography>
									</Box>
								</Box>

								<Stack spacing={0.5}>
									<ColorPicker
										label="Primary Color"
										value={localColors.primary}
										onChange={handleColorChange("primary")}
									/>
									<ColorPicker
										label="Secondary Color"
										value={localColors.secondary}
										onChange={handleColorChange("secondary")}
									/>
									<ColorPicker
										label="Background"
										value={localColors.background}
										onChange={handleColorChange("background")}
									/>
									<ColorPicker
										label="Surface/Paper"
										value={localColors.paper}
										onChange={handleColorChange("paper")}
									/>
									<ColorPicker
										label="Primary Text"
										value={localColors.textPrimary}
										onChange={handleColorChange("textPrimary")}
									/>
									<ColorPicker
										label="Secondary Text"
										value={localColors.textSecondary}
										onChange={handleColorChange("textSecondary")}
									/>
									<ColorPicker
										label="Dividers/Borders"
										value={localColors.divider}
										onChange={handleColorChange("divider")}
									/>
								</Stack>

								{/* Live Preview */}
								<Box sx={{ mt: 2 }}>
									<ThemePreview colors={localColors} />
								</Box>
							</Box>
						</Collapse>
					</Stack>
				</DialogContent>

				<DialogActions sx={{ px: 3, py: 2 }}>
					{isCustomMode && (
						<Button
							onClick={handleApplyCustomColors}
							variant="contained"
							color="primary"
							disabled={!hasChanges}
							sx={{ mr: "auto" }}
						>
							Apply Colors
						</Button>
					)}
					<Button onClick={handleClose} variant="outlined">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Unsaved Changes</DialogTitle>
				<DialogContent>
					<Typography>
						You have unsaved changes to your custom theme. Do you want to apply
						them before closing?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDiscard} color="error">
						Discard
					</Button>
					<Button
						onClick={handleConfirmApply}
						variant="contained"
						color="primary"
						autoFocus
					>
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
