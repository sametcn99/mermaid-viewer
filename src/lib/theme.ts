import { createTheme } from "@mui/material";

// Single, app-wide dark theme styled to resemble shadcn's default dark theme.
// Key choices (mapped from shadcn tokens → MUI):
// - background.default: zinc-950 (#09090B)
// - background.paper: same base, minimal elevation look
// - text.primary: zinc-200 (#E4E4E7), text.secondary: zinc-400 (#A1A1AA)
// - divider/border: zinc-800 (#27272A)
// - primary: near-white (#FAFAFA) with dark contrast (shadcn primary for dark)
// - secondary: neutral surface (#27272A)
// - radius: 0.5rem (~8px) applied via theme.shape and component overrides

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

const brand = {
	white: zinc[50],
	black: zinc[950],
	border: zinc[800],
	ring: zinc[300],
};

export const defaultTheme = createTheme({
	cssVariables: true,
	palette: {
		mode: "dark",
		primary: {
			main: brand.white, // shadcn primary on dark is near-white
			light: zinc[100],
			dark: zinc[200],
			contrastText: brand.black,
		},
		secondary: {
			main: zinc[800],
			light: zinc[700],
			dark: zinc[900],
			contrastText: brand.white,
		},
		error: { main: "#EF4444" }, // red-500
		warning: { main: "#F59E0B" }, // amber-500
		info: { main: "#60A5FA" }, // blue-400
		success: { main: "#22C55E" }, // green-500
		background: {
			default: zinc[950],
			paper: zinc[950],
		},
		text: {
			primary: zinc[200],
			secondary: zinc[400],
			disabled: zinc[600],
		},
		divider: brand.border,
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
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: zinc[950],
					color: zinc[200],
				},
				"::selection": {
					backgroundColor: brand.ring,
					color: brand.black,
				},
			},
		},

		// Surfaces
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
					border: `1px solid ${brand.border}`,
					borderRadius: 8,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: brand.border,
				},
			},
		},

		// AppBar
		MuiAppBar: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				colorDefault: {
					backgroundColor: zinc[950],
					color: zinc[200],
					borderBottom: `1px solid ${brand.border}`,
				},
			},
		},

		// Buttons
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
					backgroundColor: brand.white,
					color: brand.black,
					"&:hover": {
						backgroundColor: zinc[200],
					},
					"&:active": { filter: "brightness(0.98)" },
				},
				containedSecondary: {
					backgroundColor: zinc[800],
					color: brand.white,
					"&:hover": {
						backgroundColor: zinc[700],
					},
					"&:active": { filter: "brightness(1.05)" },
				},
				outlined: {
					borderColor: brand.border,
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

		// Inputs
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
						borderColor: brand.ring,
						boxShadow: `0 0 0 3px ${brand.ring}33`, // subtle ring
					},
				},
				notchedOutline: {
					borderColor: brand.border,
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
						boxShadow: `0 0 0 3px ${brand.ring}33`,
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

		// Menus / Popovers / Dialogs share a bordered surface look
		MuiPopover: {
			styleOverrides: {
				paper: {
					backgroundColor: zinc[950],
					border: `1px solid ${brand.border}`,
					borderRadius: 8,
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					backgroundColor: zinc[950],
					border: `1px solid ${brand.border}`,
					borderRadius: 8,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: zinc[950],
					border: `1px solid ${brand.border}`,
					borderRadius: 12,
				},
			},
		},

		// Chips
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					borderColor: brand.border,
					backgroundColor: zinc[900],
					color: zinc[200],
				},
			},
		},

		// Tooltips
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: zinc[900],
					color: zinc[200],
					border: `1px solid ${brand.border}`,
					borderRadius: 8,
				},
			},
		},

		// Snackbar/Alert
		MuiAlert: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
	},
});
