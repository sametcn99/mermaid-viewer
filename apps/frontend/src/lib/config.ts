import { z } from "zod";

const optionalEnv = z
	.string()
	.optional()
	.transform((value) => value?.trim() || undefined);

const requiredUrlEnv = z.string().trim().min(1, "NEXT_PUBLIC_API_URL is required");

const rawEnvSchema = z
	.object({
		NEXT_PUBLIC_API_URL: requiredUrlEnv,
		NEXT_PUBLIC_SITE_URL: optionalEnv,
		NEXT_PUBLIC_GEMINI_API_KEY: optionalEnv,
	})
	.strip();

type RawEnv = z.infer<typeof rawEnvSchema>;

const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);

const warnings: string[] = [];

const ensureAbsoluteUrl = (value: string | undefined): URL | undefined => {
	if (!value) {
		return undefined;
	}

	const normalized = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

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

const resolveGemini = (env: RawEnv) => {
	if (!env.NEXT_PUBLIC_GEMINI_API_KEY) {
		warnings.push("NEXT_PUBLIC_GEMINI_API_KEY is not set; AI assistant features will be disabled.");
	}

	return {
		apiKey: env.NEXT_PUBLIC_GEMINI_API_KEY,
	};
};

const resolveApi = (env: RawEnv) => {
	const hasProtocol = env.NEXT_PUBLIC_API_URL.startsWith("http://") || env.NEXT_PUBLIC_API_URL.startsWith("https://");

	if (!hasProtocol) {
		throw new Error("NEXT_PUBLIC_API_URL must include a protocol (http:// or https://)");
	}

	const apiUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_API_URL);
	if (!apiUrl) {
		throw new Error("NEXT_PUBLIC_API_URL must be an absolute http(s) URL (e.g., https://api.example.com)");
	}

	return {
		baseUrl: apiUrl.toString(),
	};
};

const resolveSite = (env: RawEnv) => {
	if (!env.NEXT_PUBLIC_SITE_URL) {
		warnings.push("NEXT_PUBLIC_SITE_URL is not set; using API URL as site URL.");
		const apiUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_API_URL);
		if (!apiUrl) {
			throw new Error("Cannot determine site URL: both NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_API_URL are invalid");
		}
		return {
			url: apiUrl,
			urlString: apiUrl.toString(),
		};
	}

	const siteUrl = ensureAbsoluteUrl(env.NEXT_PUBLIC_SITE_URL);
	if (!siteUrl) {
		throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL (e.g., https://example.com)");
	}

	return {
		url: siteUrl,
		urlString: siteUrl.toString(),
	};
};

const rawEnvSource = {
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

const rawEnvResult = rawEnvSchema.safeParse(rawEnvSource);

if (!rawEnvResult.success) {
	const aggregated = rawEnvResult.error.issues
		.map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
		.join("; ");

	throw new Error(`Invalid environment variables: ${aggregated}`);
}

const rawEnv = rawEnvResult.data;

const computedConfig = {
	api: resolveApi(rawEnv),
	site: resolveSite(rawEnv),
	gemini: resolveGemini(rawEnv),
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
	gemini: z.object({
		apiKey: z.string().min(1).optional(),
	}),
});

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

export const appConfig = freeze({
	api: freeze({
		baseUrl: data.api.baseUrl,
	}),
	site: freeze({
		url: data.site.url,
		urlString: data.site.urlString,
	}),
	gemini: freeze({
		apiKey: data.gemini.apiKey,
	}),
});

export type AppConfig = typeof appConfig;

export default appConfig;
