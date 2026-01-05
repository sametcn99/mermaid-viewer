import { STORE_NAMES, withDatabase } from ".";
import type { ThemeSettings } from "@/lib/theme";

const THEME_SETTINGS_STORE = STORE_NAMES.THEME_SETTINGS;
const THEME_SETTINGS_ID = "global";

type StoredThemeSettings = {
	id: string;
	settings: ThemeSettings;
	updatedAt: number;
};

/**
 * Get theme settings from local storage
 *
 * @returns The theme settings or null if not found
 */
export async function getThemeSettings(): Promise<ThemeSettings | null> {
	try {
		const record = await withDatabase((db) =>
			db.get(THEME_SETTINGS_STORE, THEME_SETTINGS_ID),
		);
		return (record?.settings as ThemeSettings) ?? null;
	} catch (error) {
		// Silently return null during SSR or when IndexedDB is not available
		if (
			error instanceof Error &&
			error.message.includes("IndexedDB is not supported")
		) {
			return null;
		}
		console.error("Failed to get theme settings:", error);
		return null;
	}
}

/**
 * Save theme settings to local storage
 *
 * @param settings The theme settings to save
 */
export async function saveThemeSettings(
	settings: ThemeSettings,
): Promise<void> {
	try {
		const record: StoredThemeSettings = {
			id: THEME_SETTINGS_ID,
			settings,
			updatedAt: Date.now(),
		};
		await withDatabase((db) => db.put(THEME_SETTINGS_STORE, record));
	} catch (error) {
		// Silently skip during SSR or when IndexedDB is not available
		if (
			error instanceof Error &&
			error.message.includes("IndexedDB is not supported")
		) {
			return;
		}
		console.error("Failed to save theme settings:", error);
	}
}
