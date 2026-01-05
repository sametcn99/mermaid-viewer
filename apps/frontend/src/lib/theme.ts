import { createTheme, type Theme, type ThemeOptions } from "@mui/material";

// Theme mode types
export type ThemeMode = "default" | "light" | "dark" | "custom";

// Custom theme colors interface
export interface CustomThemeColors {
	primary: string;
	secondary: string;
	background: string;
	paper: string;
	textPrimary: string;
	textSecondary: string;
	divider: string;
	mode: "light" | "dark";
}

// Default custom colors
export const defaultCustomColors: CustomThemeColors = {
	primary: "#6366F1", // Indigo
	secondary: "#8B5CF6", // Purple
	background: "#0F172A", // Slate 900
	paper: "#1E293B", // Slate 800
	textPrimary: "#F1F5F9", // Slate 100
	textSecondary: "#94A3B8", // Slate 400
	divider: "#334155", // Slate 700
	mode: "dark",
};

// Theme settings interface for localStorage
export interface ThemeSettings {
	themeMode: ThemeMode;
	customColors: CustomThemeColors;
}

export const defaultThemeSettings: ThemeSettings = {
	themeMode: "default",
	customColors: defaultCustomColors,
};

// Zinc color palette used by both themes
const zinc = {
	50: "#FAFAFA",
	100: "#F4F4F5",
	200: "#E4E4E7",
	300: "#D4D4D8",
	400: "#A1A1AA",
	500: "#71717A",
	600: "#52525B",
	700: "#3F3F46",
	800: "#27272A",
	900: "#18181B",
	950: "#09090B",
} as const;

const brandDark = {
	white: zinc[50],
	black: zinc[950],
	border: zinc[800],
	ring: zinc[300],
};

const brandLight = {
	white: zinc[950],
	black: zinc[50],
	border: zinc[300],
	ring: zinc[600],
};

// Base theme options shared between themes
const baseThemeOptions: ThemeOptions = {
	cssVariables: true,
	typography: {
		fontFamily:
			'Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
		button: {
			textTransform: "none",
			fontWeight: 500,
			letterSpacing: "-0.01em",
		},
	},
	shape: {
		borderRadius: 8, // 0.5rem
	},
};

// Create dark theme
function createDarkTheme(): Theme {
	return createTheme({
		...baseThemeOptions,
		palette: {
			mode: "dark",
			primary: {
				main: brandDark.white,
				light: zinc[100],
				dark: zinc[200],
				contrastText: brandDark.black,
			},
			secondary: {
				main: zinc[800],
				light: zinc[700],
				dark: zinc[900],
				contrastText: brandDark.white,
			},
			error: { main: "#EF4444" },
			warning: { main: "#F59E0B" },
			info: { main: "#60A5FA" },
			success: { main: "#22C55E" },
			background: {
				default: zinc[950],
				paper: zinc[950],
			},
			text: {
				primary: zinc[200],
				secondary: zinc[400],
				disabled: zinc[600],
			},
			divider: brandDark.border,
			grey: {
				50: zinc[50],
				100: zinc[100],
				200: zinc[200],
				300: zinc[300],
				400: zinc[400],
				500: zinc[500],
				600: zinc[600],
				700: zinc[700],
				800: zinc[800],
				900: zinc[900],
				A100: zinc[100],
				A200: zinc[200],
				A400: zinc[400],
				A700: zinc[700],
			},
			contrastThreshold: 3,
			tonalOffset: 0.2,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: zinc[950],
						color: zinc[200],
					},
					"::selection": {
						backgroundColor: brandDark.ring,
						color: brandDark.black,
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: "none",
					},
				},
			},
			MuiCard: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					root: {
						backgroundColor: zinc[950],
						border: `1px solid ${brandDark.border}`,
						borderRadius: 8,
					},
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderColor: brandDark.border,
					},
				},
			},
			MuiAppBar: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					colorDefault: {
						backgroundColor: zinc[950],
						color: zinc[200],
						borderBottom: `1px solid ${brandDark.border}`,
					},
				},
			},
			MuiButtonBase: {
				defaultProps: {
					disableRipple: true,
				},
			},
			MuiButton: {
				defaultProps: {
					disableElevation: true,
					size: "medium",
				},
				styleOverrides: {
					root: {
						borderRadius: 8,
						textTransform: "none",
						fontWeight: 500,
					},
					sizeSmall: {
						height: 36,
						paddingInline: 14,
					},
					sizeMedium: {
						height: 40,
						paddingInline: 16,
					},
					sizeLarge: {
						height: 44,
						paddingInline: 20,
					},
					containedPrimary: {
						backgroundColor: brandDark.white,
						color: brandDark.black,
						"&:hover": {
							backgroundColor: zinc[200],
						},
						"&:active": { filter: "brightness(0.98)" },
					},
					containedSecondary: {
						backgroundColor: zinc[800],
						color: brandDark.white,
						"&:hover": {
							backgroundColor: zinc[700],
						},
						"&:active": { filter: "brightness(1.05)" },
					},
					outlined: {
						borderColor: brandDark.border,
						color: zinc[200],
						"&:hover": {
							borderColor: zinc[700],
							backgroundColor: zinc[800],
						},
					},
					text: {
						color: zinc[200],
						"&:hover": {
							backgroundColor: zinc[900],
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						color: zinc[200],
						"&:hover": {
							backgroundColor: zinc[900],
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						color: zinc[400],
						"&.Mui-focused": {
							color: zinc[300],
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: "transparent",
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: zinc[700],
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: brandDark.ring,
							boxShadow: `0 0 0 3px ${brandDark.ring}33`,
						},
					},
					notchedOutline: {
						borderColor: brandDark.border,
					},
					input: {
						height: 40,
						padding: "10px 12px",
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: zinc[900],
						"&:hover": { backgroundColor: zinc[900] },
						"&.Mui-focused": {
							backgroundColor: zinc[900],
							boxShadow: `0 0 0 3px ${brandDark.ring}33`,
						},
					},
					input: { height: 40 },
				},
			},
			MuiTextField: {
				defaultProps: {
					variant: "outlined",
					size: "small",
					fullWidth: true,
				},
			},
			MuiPopover: {
				styleOverrides: {
					paper: {
						backgroundColor: zinc[950],
						border: `1px solid ${brandDark.border}`,
						borderRadius: 8,
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: zinc[950],
						border: `1px solid ${brandDark.border}`,
						borderRadius: 8,
					},
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						backgroundColor: zinc[950],
						border: `1px solid ${brandDark.border}`,
						borderRadius: 12,
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						borderColor: brandDark.border,
						backgroundColor: zinc[900],
						color: zinc[200],
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						backgroundColor: zinc[900],
						color: zinc[200],
						border: `1px solid ${brandDark.border}`,
						borderRadius: 8,
					},
				},
			},
			MuiAlert: {
				styleOverrides: {
					root: {
						borderRadius: 8,
					},
				},
			},
		},
	});
}

// Create light theme
function createLightTheme(): Theme {
	return createTheme({
		...baseThemeOptions,
		palette: {
			mode: "light",
			primary: {
				main: zinc[900],
				light: zinc[700],
				dark: zinc[950],
				contrastText: zinc[50],
			},
			secondary: {
				main: zinc[200],
				light: zinc[100],
				dark: zinc[300],
				contrastText: zinc[900],
			},
			error: { main: "#DC2626" },
			warning: { main: "#D97706" },
			info: { main: "#2563EB" },
			success: { main: "#16A34A" },
			background: {
				default: zinc[50],
				paper: "#FFFFFF",
			},
			text: {
				primary: zinc[900],
				secondary: zinc[600],
				disabled: zinc[400],
			},
			divider: zinc[200],
			grey: {
				50: zinc[50],
				100: zinc[100],
				200: zinc[200],
				300: zinc[300],
				400: zinc[400],
				500: zinc[500],
				600: zinc[600],
				700: zinc[700],
				800: zinc[800],
				900: zinc[900],
				A100: zinc[100],
				A200: zinc[200],
				A400: zinc[400],
				A700: zinc[700],
			},
			contrastThreshold: 3,
			tonalOffset: 0.2,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: zinc[50],
						color: zinc[900],
					},
					"::selection": {
						backgroundColor: zinc[300],
						color: zinc[900],
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: "none",
					},
				},
			},
			MuiCard: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					root: {
						backgroundColor: "#FFFFFF",
						border: `1px solid ${zinc[200]}`,
						borderRadius: 8,
					},
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderColor: zinc[200],
					},
				},
			},
			MuiAppBar: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					colorDefault: {
						backgroundColor: "#FFFFFF",
						color: zinc[900],
						borderBottom: `1px solid ${zinc[200]}`,
					},
				},
			},
			MuiButtonBase: {
				defaultProps: {
					disableRipple: true,
				},
			},
			MuiButton: {
				defaultProps: {
					disableElevation: true,
					size: "medium",
				},
				styleOverrides: {
					root: {
						borderRadius: 8,
						textTransform: "none",
						fontWeight: 500,
					},
					sizeSmall: {
						height: 36,
						paddingInline: 14,
					},
					sizeMedium: {
						height: 40,
						paddingInline: 16,
					},
					sizeLarge: {
						height: 44,
						paddingInline: 20,
					},
					containedPrimary: {
						backgroundColor: zinc[900],
						color: zinc[50],
						"&:hover": {
							backgroundColor: zinc[800],
						},
						"&:active": { filter: "brightness(0.98)" },
					},
					containedSecondary: {
						backgroundColor: zinc[200],
						color: zinc[900],
						"&:hover": {
							backgroundColor: zinc[300],
						},
						"&:active": { filter: "brightness(0.98)" },
					},
					outlined: {
						borderColor: zinc[300],
						color: zinc[900],
						"&:hover": {
							borderColor: zinc[400],
							backgroundColor: zinc[100],
						},
					},
					text: {
						color: zinc[900],
						"&:hover": {
							backgroundColor: zinc[100],
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						color: zinc[700],
						"&:hover": {
							backgroundColor: zinc[100],
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						color: zinc[600],
						"&.Mui-focused": {
							color: zinc[700],
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: "transparent",
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: zinc[400],
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: zinc[600],
							boxShadow: `0 0 0 3px ${zinc[200]}`,
						},
					},
					notchedOutline: {
						borderColor: zinc[300],
					},
					input: {
						height: 40,
						padding: "10px 12px",
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: zinc[100],
						"&:hover": { backgroundColor: zinc[100] },
						"&.Mui-focused": {
							backgroundColor: zinc[100],
							boxShadow: `0 0 0 3px ${zinc[200]}`,
						},
					},
					input: { height: 40 },
				},
			},
			MuiTextField: {
				defaultProps: {
					variant: "outlined",
					size: "small",
					fullWidth: true,
				},
			},
			MuiPopover: {
				styleOverrides: {
					paper: {
						backgroundColor: "#FFFFFF",
						border: `1px solid ${zinc[200]}`,
						borderRadius: 8,
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: "#FFFFFF",
						border: `1px solid ${zinc[200]}`,
						borderRadius: 8,
					},
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						backgroundColor: "#FFFFFF",
						border: `1px solid ${zinc[200]}`,
						borderRadius: 12,
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						borderColor: zinc[200],
						backgroundColor: zinc[100],
						color: zinc[900],
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						backgroundColor: zinc[900],
						color: zinc[50],
						border: "none",
						borderRadius: 8,
					},
				},
			},
			MuiAlert: {
				styleOverrides: {
					root: {
						borderRadius: 8,
					},
				},
			},
		},
	});
}

// Create custom theme from user colors
export function createCustomTheme(colors: CustomThemeColors): Theme {
	const isDark = colors.mode === "dark";
	const borderColor = colors.divider;
	const ringColor = isDark
		? adjustBrightness(colors.primary, 30)
		: adjustBrightness(colors.primary, -30);

	return createTheme({
		...baseThemeOptions,
		palette: {
			mode: colors.mode,
			primary: {
				main: colors.primary,
				contrastText: getContrastColor(colors.primary),
			},
			secondary: {
				main: colors.secondary,
				contrastText: getContrastColor(colors.secondary),
			},
			error: { main: "#EF4444" },
			warning: { main: "#F59E0B" },
			info: { main: "#60A5FA" },
			success: { main: "#22C55E" },
			background: {
				default: colors.background,
				paper: colors.paper,
			},
			text: {
				primary: colors.textPrimary,
				secondary: colors.textSecondary,
			},
			divider: colors.divider,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						backgroundColor: colors.background,
						color: colors.textPrimary,
					},
					"::selection": {
						backgroundColor: colors.primary,
						color: getContrastColor(colors.primary),
					},
				},
			},
			MuiPaper: {
				styleOverrides: {
					root: {
						backgroundImage: "none",
					},
				},
			},
			MuiCard: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					root: {
						backgroundColor: colors.paper,
						border: `1px solid ${borderColor}`,
						borderRadius: 8,
					},
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderColor: borderColor,
					},
				},
			},
			MuiAppBar: {
				defaultProps: { elevation: 0 },
				styleOverrides: {
					colorDefault: {
						backgroundColor: colors.paper,
						color: colors.textPrimary,
						borderBottom: `1px solid ${borderColor}`,
					},
				},
			},
			MuiButtonBase: {
				defaultProps: {
					disableRipple: true,
				},
			},
			MuiButton: {
				defaultProps: {
					disableElevation: true,
					size: "medium",
				},
				styleOverrides: {
					root: {
						borderRadius: 8,
						textTransform: "none",
						fontWeight: 500,
					},
					sizeSmall: {
						height: 36,
						paddingInline: 14,
					},
					sizeMedium: {
						height: 40,
						paddingInline: 16,
					},
					sizeLarge: {
						height: 44,
						paddingInline: 20,
					},
					containedPrimary: {
						backgroundColor: colors.primary,
						color: getContrastColor(colors.primary),
						"&:hover": {
							backgroundColor: adjustBrightness(
								colors.primary,
								isDark ? 15 : -15,
							),
						},
					},
					containedSecondary: {
						backgroundColor: colors.secondary,
						color: getContrastColor(colors.secondary),
						"&:hover": {
							backgroundColor: adjustBrightness(
								colors.secondary,
								isDark ? 15 : -15,
							),
						},
					},
					outlined: {
						borderColor: borderColor,
						color: colors.textPrimary,
						"&:hover": {
							borderColor: colors.primary,
							backgroundColor: `${colors.primary}15`,
						},
					},
					text: {
						color: colors.textPrimary,
						"&:hover": {
							backgroundColor: `${colors.primary}15`,
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						color: colors.textPrimary,
						"&:hover": {
							backgroundColor: `${colors.primary}20`,
						},
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						color: colors.textSecondary,
						"&.Mui-focused": {
							color: colors.primary,
						},
					},
				},
			},
			MuiOutlinedInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: "transparent",
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: colors.primary,
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: colors.primary,
							boxShadow: `0 0 0 3px ${ringColor}33`,
						},
					},
					notchedOutline: {
						borderColor: borderColor,
					},
					input: {
						height: 40,
						padding: "10px 12px",
					},
				},
			},
			MuiFilledInput: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						backgroundColor: isDark
							? adjustBrightness(colors.background, 10)
							: adjustBrightness(colors.background, -5),
						"&:hover": {
							backgroundColor: isDark
								? adjustBrightness(colors.background, 10)
								: adjustBrightness(colors.background, -5),
						},
						"&.Mui-focused": {
							backgroundColor: isDark
								? adjustBrightness(colors.background, 10)
								: adjustBrightness(colors.background, -5),
							boxShadow: `0 0 0 3px ${ringColor}33`,
						},
					},
					input: { height: 40 },
				},
			},
			MuiTextField: {
				defaultProps: {
					variant: "outlined",
					size: "small",
					fullWidth: true,
				},
			},
			MuiPopover: {
				styleOverrides: {
					paper: {
						backgroundColor: colors.paper,
						border: `1px solid ${borderColor}`,
						borderRadius: 8,
					},
				},
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						backgroundColor: colors.paper,
						border: `1px solid ${borderColor}`,
						borderRadius: 8,
					},
				},
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						backgroundColor: colors.paper,
						border: `1px solid ${borderColor}`,
						borderRadius: 12,
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						borderColor: borderColor,
						backgroundColor: isDark
							? adjustBrightness(colors.background, 10)
							: adjustBrightness(colors.background, -5),
						color: colors.textPrimary,
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						backgroundColor: isDark ? zinc[800] : zinc[900],
						color: zinc[50],
						border: `1px solid ${borderColor}`,
						borderRadius: 8,
					},
				},
			},
			MuiAlert: {
				styleOverrides: {
					root: {
						borderRadius: 8,
					},
				},
			},
		},
	});
}

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
	const num = Number.parseInt(hex.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = Math.max(0, Math.min(255, (num >> 16) + amt));
	const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
	const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
	return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

// Helper function to get contrasting text color
function getContrastColor(hex: string): string {
	const num = Number.parseInt(hex.replace("#", ""), 16);
	const R = num >> 16;
	const G = (num >> 8) & 0x00ff;
	const B = num & 0x0000ff;
	const luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
	return luminance > 0.5 ? "#09090B" : "#FAFAFA";
}

// Pre-created themes
export const darkTheme = createDarkTheme();
export const lightTheme = createLightTheme();

// Default theme (same as dark theme for backward compatibility)
export const defaultTheme = darkTheme;

// Get theme based on mode and custom colors
export function getTheme(
	mode: ThemeMode,
	customColors: CustomThemeColors,
	systemPrefersDark: boolean,
): Theme {
	switch (mode) {
		case "light":
			return lightTheme;
		case "dark":
			return darkTheme;
		case "custom":
			return createCustomTheme(customColors);
		case "default":
		default:
			return systemPrefersDark ? darkTheme : lightTheme;
	}
}
