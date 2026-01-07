import type { MermaidConfig } from "mermaid";
import {
	getMermaidConfig,
	saveMermaidConfig,
} from "@/lib/indexed-db/mermaid-config.storage";
import { updateBrowserUrlWithDiagramSettings } from "@/lib/utils/url.utils";

type Nullable<T> = T | null | undefined;

export interface DiagramSettingsConfig extends MermaidConfig {
	useCustomColors?: boolean;
}

export type DiagramSettingsInput = Nullable<
	Partial<DiagramSettingsConfig> | Record<string, unknown>
>;

export const defaultDiagramSettings: DiagramSettingsConfig = {
	startOnLoad: false,
	theme: "default",
	useCustomColors: false,
	themeVariables: {},
	flowchart: {},
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const deepClean = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		const cleaned = value
			.map((item) => deepClean(item))
			.filter((item) => item !== undefined);
		return cleaned.length > 0 ? cleaned : undefined;
	}

	if (isPlainObject(value)) {
		const entries = Object.entries(value)
			.map(([key, val]) => [key, deepClean(val)] as const)
			.filter(([, val]) => val !== undefined && val !== "");
		if (entries.length === 0) return undefined;
		return Object.fromEntries(entries);
	}

	if (value === undefined) return undefined;
	return value;
};

const stableSerialize = (value: unknown): string => {
	if (value === null || typeof value !== "object") {
		return JSON.stringify(value);
	}

	if (Array.isArray(value)) {
		return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
	}

	const entries = Object.entries(value as Record<string, unknown>).sort(
		([keyA], [keyB]) => keyA.localeCompare(keyB),
	);
	return `{${entries
		.map(([key, val]) => `${JSON.stringify(key)}:${stableSerialize(val)}`)
		.join(",")}}`;
};

const defaultSignature = stableSerialize(deepClean(defaultDiagramSettings));

export const DIAGRAM_SETTINGS_EVENT = "diagramSettingsApplied";

export const mergeDiagramSettings = (
	input?: DiagramSettingsInput,
): DiagramSettingsConfig => {
	if (!input || typeof input !== "object") {
		return { ...defaultDiagramSettings };
	}

	const overrides = input as DiagramSettingsConfig;
	return {
		...defaultDiagramSettings,
		...overrides,
		themeVariables: {
			...(defaultDiagramSettings.themeVariables ?? {}),
			...(overrides.themeVariables ?? {}),
		},
		flowchart: {
			...(defaultDiagramSettings.flowchart ?? {}),
			...(overrides.flowchart ?? {}),
		},
	};
};

export const diagramSettingsSignature = (
	input?: DiagramSettingsInput,
): string => {
	const merged = mergeDiagramSettings(input);
	return stableSerialize(deepClean(merged));
};

export const isDefaultDiagramSettings = (
	input?: DiagramSettingsInput,
): boolean => diagramSettingsSignature(input) === defaultSignature;

export const broadcastDiagramSettings = (
	config: DiagramSettingsConfig,
): void => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(
		new CustomEvent(DIAGRAM_SETTINGS_EVENT, { detail: config }),
	);
};

export const applyDiagramSettings = async (
	input?: DiagramSettingsInput,
): Promise<DiagramSettingsConfig> => {
	const merged = mergeDiagramSettings(input);
	await saveMermaidConfig(merged);
	if (isDefaultDiagramSettings(merged)) {
		updateBrowserUrlWithDiagramSettings(null);
	} else {
		updateBrowserUrlWithDiagramSettings(merged);
	}
	broadcastDiagramSettings(merged);
	return merged;
};

export const loadStoredDiagramSettings =
	async (): Promise<DiagramSettingsConfig> => {
		const stored = (await getMermaidConfig()) as DiagramSettingsInput;
		return mergeDiagramSettings(stored);
	};
