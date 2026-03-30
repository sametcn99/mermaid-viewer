import { z } from "zod";

const optionalEnv = z
	.string()
	.optional()
	.transform((value) => value?.trim() || undefined);

const requiredUrlEnv = z
	.string()
	.trim()
	.min(1, "NEXT_PUBLIC_API_URL is required");

const rawEnvSchema = z
	.object({
		NEXT_PUBLIC_API_URL: requiredUrlEnv,
		NEXT_PUBLIC_SITE_URL: optionalEnv,
	})
	.strip();

type RawEnv = z.infer<typeof rawEnvSchema>;
type RawEnvSource = Partial<Record<keyof RawEnv, string | undefined>>;

export type AppConfig = Readonly<{
	api: Readonly<{
		baseUrl: string;
	}>;
	site: Readonly<{
		url: URL;
		urlString: string;
	}>;
}>;

const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);
const trimEnv = (value: string | undefined): string | undefined =>
	value?.trim() || undefined;

const ensureAbsoluteUrl = (value: string | undefined): URL | undefined => {
	if (!value) {
		return undefined;
	}

	const normalized =
		value.startsWith("http://") || value.startsWith("https://")
			? value
			: `https://${value}`;

	try {
		const url = new URL(normalized);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return undefined;
		}
		return url;
	} catch {
		return undefined;
	}
};

const resolveApi = (env: RawEnv) => {
	const hasProtocol =
		env.NEXT_PUBLIC_API_URL.startsWith("http://") ||
		env.NEXT_PUBLIC_API_URL.startsWith("https://");

	if (!hasProtocol) {
		throw new Error(
			"NEXT_PUBLIC_API_URL must include a protocol (http:// or https://)",
		);
	}

	const apiUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_API_URL);
	if (!apiUrl) {
		throw new Error(
			"NEXT_PUBLIC_API_URL must be an absolute http(s) URL (e.g., https://api.example.com)",
		);
	}

	return {
		baseUrl: apiUrl.toString(),
	};
};

const resolveSite = (env: RawEnv, warnings: string[]) => {
	if (!env.NEXT_PUBLIC_SITE_URL) {
		warnings.push(
			"NEXT_PUBLIC_SITE_URL is not set; using API URL as site URL.",
		);
		const apiUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_API_URL);
		if (!apiUrl) {
			throw new Error(
				"Cannot determine site URL: both NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_API_URL are invalid",
			);
		}
		return {
			url: apiUrl,
			urlString: apiUrl.toString(),
		};
	}

	const siteUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_SITE_URL);
	if (!siteUrl) {
		throw new Error(
			"NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL (e.g., https://example.com)",
		);
	}

	return {
		url: siteUrl,
		urlString: siteUrl.toString(),
	};
};

const configSchema = z.object({
	api: z.object({
		baseUrl: z.string().url(),
	}),
	site: z
		.object({
			url: z.instanceof(URL),
			urlString: z.url(),
		})
		.superRefine((site, ctx) => {
			if (site.url.toString() !== site.urlString) {
				ctx.addIssue({
					code: "custom",
					message: "Site URL mismatch",
					path: ["urlString"],
				});
			}
		}),
});

let cachedConfig: AppConfig | undefined;

const getBrowserFallbackEnv = (): {
	source: RawEnvSource;
	warnings: string[];
} => {
	if (typeof window === "undefined") {
		return {
			source: {},
			warnings: [],
		};
	}

	const fallbackApiUrl =
		window.location.port === "3000"
			? `${window.location.protocol}//${window.location.hostname}:3001`
			: new URL("/api", window.location.origin).toString();

	return {
		source: {
			NEXT_PUBLIC_API_URL: fallbackApiUrl,
			NEXT_PUBLIC_SITE_URL: window.location.origin,
		},
		warnings: [
			`NEXT_PUBLIC_API_URL is not set; using browser fallback ${fallbackApiUrl}.`,
		],
	};
};

const getRawEnvSource = (): { source: RawEnvSource; warnings: string[] } => {
	const warnings: string[] = [];
	const browserFallback = getBrowserFallbackEnv();
	const apiUrl =
		trimEnv(process.env.NEXT_PUBLIC_API_URL) ??
		browserFallback.source.NEXT_PUBLIC_API_URL;
	const siteUrl =
		trimEnv(process.env.NEXT_PUBLIC_SITE_URL) ??
		browserFallback.source.NEXT_PUBLIC_SITE_URL;

	if (!trimEnv(process.env.NEXT_PUBLIC_API_URL)) {
		warnings.push(...browserFallback.warnings);
	}

	return {
		source: {
			NEXT_PUBLIC_API_URL: apiUrl,
			NEXT_PUBLIC_SITE_URL: siteUrl,
		},
		warnings,
	};
};

export const getAppConfig = (): AppConfig => {
	if (cachedConfig) {
		return cachedConfig;
	}

	const { source, warnings } = getRawEnvSource();
	const rawEnvResult = rawEnvSchema.safeParse(source);

	if (!rawEnvResult.success) {
		const aggregated = rawEnvResult.error.issues
			.map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
			.join("; ");

		throw new Error(`Invalid environment variables: ${aggregated}`);
	}

	const rawEnv = rawEnvResult.data;
	const computedConfig = {
		api: resolveApi(rawEnv),
		site: resolveSite(rawEnv, warnings),
	};
	const configResult = configSchema.safeParse(computedConfig);

	if (!configResult.success) {
		const aggregated = configResult.error.issues
			.map((issue) => `${issue.path.join(".") || "config"}: ${issue.message}`)
			.join("; ");

		throw new Error(`Invalid application configuration: ${aggregated}`);
	}

	const { data } = configResult;

	if (warnings.length) {
		console.warn(`Environment warnings:\n- ${warnings.join("\n- ")}`);
	}

	cachedConfig = freeze({
		api: freeze({
			baseUrl: data.api.baseUrl,
		}),
		site: freeze({
			url: data.site.url,
			urlString: data.site.urlString,
		}),
	});

	return cachedConfig;
};

export const appConfig = {
	get api() {
		return getAppConfig().api;
	},
	get site() {
		return getAppConfig().site;
	},
} as AppConfig;

export default appConfig;
