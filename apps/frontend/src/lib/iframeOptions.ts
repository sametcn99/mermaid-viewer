export interface IframeOptions {
	enableZoom: boolean;
	enablePan: boolean;
	enablePinch: boolean;
	background: string;
	initialZoom: number;
	minZoom: number;
	maxZoom: number;
}

export interface IframeOptionParseResult {
	options: IframeOptions;
	warnings: string[];
}

const KNOWN_PARAMS = new Set([
	"mermaid",
	"enableZoom",
	"enablePan",
	"enablePinch",
	"background",
	"initialZoom",
	"minZoom",
	"maxZoom",
]);

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const DEFAULT_IFRAME_OPTIONS: IframeOptions = Object.freeze({
	enableZoom: true,
	enablePan: true,
	enablePinch: true,
	background: "#ffffff",
	initialZoom: 1,
	minZoom: 0.1,
	maxZoom: 10,
});

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export const isValidIframeBackground = (value: string) =>
	HEX_COLOR_PATTERN.test(value);

const parseBoolean = (value: string | null, fallback: boolean) => {
	if (value === null) return fallback;
	if (value.toLowerCase() === "true") return true;
	if (value.toLowerCase() === "false") return false;
	return fallback;
};

const parseNumeric = (
	value: string | null,
	fallback: number,
	min: number,
	max: number,
	paramName: string,
	warnings: string[],
): number => {
	if (value === null) return fallback;
	const parsed = Number.parseFloat(value);
	if (!Number.isFinite(parsed)) {
		warnings.push(
			`Parameter "${paramName}" has an invalid numeric value. Using default ${fallback}.`,
		);
		return fallback;
	}
	if (parsed < min || parsed > max) {
		const clamped = clamp(parsed, min, max);
		warnings.push(
			`Parameter "${paramName}" is out of bounds (${min}-${max}). Clamping to ${clamped}.`,
		);
		return clamped;
	}
	return parsed;
};

export const parseIframeOptions = (
	search: string | undefined,
): IframeOptionParseResult => {
	if (!search) {
		return {
			options: { ...DEFAULT_IFRAME_OPTIONS },
			warnings: [],
		};
	}

	const params = new URLSearchParams(search);
	const warnings: string[] = [];
	const options: IframeOptions = { ...DEFAULT_IFRAME_OPTIONS };

	const background = params.get("background");
	if (background) {
		if (isValidIframeBackground(background)) {
			options.background = background;
		} else {
			warnings.push(
				`Parameter "background" must be a hex color value. Using default ${options.background}.`,
			);
		}
	}

	options.enableZoom = parseBoolean(
		params.get("enableZoom"),
		options.enableZoom,
	);
	options.enablePan = parseBoolean(params.get("enablePan"), options.enablePan);
	options.enablePinch = parseBoolean(
		params.get("enablePinch"),
		options.enablePinch,
	);

	options.minZoom = parseNumeric(
		params.get("minZoom"),
		options.minZoom,
		0.05,
		50,
		"minZoom",
		warnings,
	);
	options.maxZoom = parseNumeric(
		params.get("maxZoom"),
		options.maxZoom,
		0.1,
		100,
		"maxZoom",
		warnings,
	);

	if (options.minZoom >= options.maxZoom) {
		warnings.push(
			`Parameter "minZoom" must be less than "maxZoom". Reverting to defaults ${DEFAULT_IFRAME_OPTIONS.minZoom}/${DEFAULT_IFRAME_OPTIONS.maxZoom}.`,
		);
		options.minZoom = DEFAULT_IFRAME_OPTIONS.minZoom;
		options.maxZoom = DEFAULT_IFRAME_OPTIONS.maxZoom;
	}

	options.initialZoom = parseNumeric(
		params.get("initialZoom"),
		options.initialZoom,
		options.minZoom,
		options.maxZoom,
		"initialZoom",
		warnings,
	);

	if (
		options.initialZoom < options.minZoom ||
		options.initialZoom > options.maxZoom
	) {
		const clamped = clamp(
			options.initialZoom,
			options.minZoom,
			options.maxZoom,
		);
		warnings.push(
			`Parameter "initialZoom" must be between "minZoom" and "maxZoom". Clamping to ${clamped}.`,
		);
		options.initialZoom = clamped;
	}

	for (const key of params.keys()) {
		if (!KNOWN_PARAMS.has(key)) {
			warnings.push(`Unknown iframe parameter "${key}" was ignored.`);
		}
	}

	return { options, warnings };
};

export const buildIframeOptionsQuery = (options: IframeOptions): string => {
	const params = new URLSearchParams();

	if (options.enableZoom !== DEFAULT_IFRAME_OPTIONS.enableZoom) {
		params.set("enableZoom", String(options.enableZoom));
	}
	if (options.enablePan !== DEFAULT_IFRAME_OPTIONS.enablePan) {
		params.set("enablePan", String(options.enablePan));
	}
	if (options.enablePinch !== DEFAULT_IFRAME_OPTIONS.enablePinch) {
		params.set("enablePinch", String(options.enablePinch));
	}
	if (options.background !== DEFAULT_IFRAME_OPTIONS.background) {
		params.set("background", options.background);
	}
	if (options.initialZoom !== DEFAULT_IFRAME_OPTIONS.initialZoom) {
		params.set("initialZoom", normalizeNumeric(options.initialZoom));
	}
	if (options.minZoom !== DEFAULT_IFRAME_OPTIONS.minZoom) {
		params.set("minZoom", normalizeNumeric(options.minZoom));
	}
	if (options.maxZoom !== DEFAULT_IFRAME_OPTIONS.maxZoom) {
		params.set("maxZoom", normalizeNumeric(options.maxZoom));
	}

	return params.toString();
};

const normalizeNumeric = (value: number) =>
	Number.parseFloat(value.toFixed(3)).toString();
