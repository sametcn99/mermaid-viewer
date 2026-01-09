"use client";

import {
	getTheme,
	defaultThemeSettings,
	type ThemeMode,
	type ThemeSettings,
	type CustomThemeColors,
} from "@/lib/theme";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import type React from "react";
import {
	createContext,
	useContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	getThemeSettings,
	saveThemeSettings,
} from "@/lib/indexed-db/theme.storage";

// Theme Context Types
interface ThemeContextType {
	themeMode: ThemeMode;
	customColors: CustomThemeColors;
	setThemeMode: (mode: ThemeMode) => void;
	setCustomColors: (colors: CustomThemeColors) => void;
	resetCustomColors: () => void;
	isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeSettings() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useThemeSettings must be used within ThemeRegistry");
	}
	return context;
}

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const [isLoading, setIsLoading] = useState(true);
	const [themeSettings, setThemeSettings] =
		useState<ThemeSettings>(defaultThemeSettings);

	// Load theme settings from localStorage on mount
	useEffect(() => {
		let isMounted = true;
		const loadSettings = async () => {
			try {
				const savedSettings = await getThemeSettings();
				if (savedSettings && isMounted) {
					setThemeSettings({
						themeMode:
							savedSettings.themeMode ?? defaultThemeSettings.themeMode,
						customColors: {
							...defaultThemeSettings.customColors,
							...savedSettings.customColors,
						},
					});
				}
			} catch (error) {
				console.error("Failed to load theme settings:", error);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};
		loadSettings();
		return () => {
			isMounted = false;
		};
	}, []);

	// Save theme settings to localStorage whenever they change
	const saveSettings = useCallback(async (settings: ThemeSettings) => {
		try {
			await saveThemeSettings(settings);
		} catch (error) {
			console.error("Failed to save theme settings:", error);
		}
	}, []);

	const setThemeMode = useCallback(
		(mode: ThemeMode) => {
			const newSettings = { ...themeSettings, themeMode: mode };
			setThemeSettings(newSettings);
			saveSettings(newSettings);
		},
		[themeSettings, saveSettings],
	);

	const setCustomColors = useCallback(
		(colors: CustomThemeColors) => {
			const newSettings = { ...themeSettings, customColors: colors };
			setThemeSettings(newSettings);
			saveSettings(newSettings);
		},
		[themeSettings, saveSettings],
	);

	const resetCustomColors = useCallback(() => {
		const newSettings = {
			...themeSettings,
			customColors: defaultThemeSettings.customColors,
		};
		setThemeSettings(newSettings);
		saveSettings(newSettings);
	}, [themeSettings, saveSettings]);

	const theme = useMemo(
		() =>
			getTheme(
				themeSettings.themeMode,
				themeSettings.customColors,
				prefersDarkMode,
			),
		[themeSettings.themeMode, themeSettings.customColors, prefersDarkMode],
	);

	const contextValue = useMemo(
		() => ({
			themeMode: themeSettings.themeMode,
			customColors: themeSettings.customColors,
			setThemeMode,
			setCustomColors,
			resetCustomColors,
			isLoading,
		}),
		[
			themeSettings.themeMode,
			themeSettings.customColors,
			setThemeMode,
			setCustomColors,
			resetCustomColors,
			isLoading,
		],
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
}
