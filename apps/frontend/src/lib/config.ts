import { z } from "zod";

const DEFAULTS = Object.freeze({
	siteUrl: "https://mermaid.sametcc.me",
	publisherName: "sametcn99",
	publisherWebsite: "https://sametcc.me",
	repositoryUrl: "https://sametcc.me/repo/mermaid-viewer",
});

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
		VERCEL_URL: optionalEnv,
		NEXT_PUBLIC_PUBLISHER_NAME: optionalEnv,
		NEXT_PUBLIC_PUBLISHER_WEBSITE: optionalEnv,
		NEXT_PUBLIC_GITHUB_REPOSITORY_URL: optionalEnv,
		NEXT_PUBLIC_GITHUB_REPOSITORY: optionalEnv,
		GEMINI_API_KEY: optionalEnv,
	})
	.strip();

type RawEnv = z.infer<typeof rawEnvSchema>;

const freeze = <T>(value: T): Readonly<T> => Object.freeze(value);

const warnings: string[] = [];

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

const asOptionalUrl = (
	value: string | undefined,
	key: keyof RawEnv,
): URL | undefined => {
	const url = ensureAbsoluteUrl(value);
	if (value && !url) {
		warnings.push(`${key} is set but is not a valid http(s) URL; ignoring it.`);
	}
	return url;
};

const resolveSite = (env: RawEnv) => {
	const siteUrl =
		asOptionalUrl(env.NEXT_PUBLIC_SITE_URL, "NEXT_PUBLIC_SITE_URL") ??
		asOptionalUrl(env.VERCEL_URL, "VERCEL_URL") ??
		new URL(DEFAULTS.siteUrl);

	if (!env.NEXT_PUBLIC_SITE_URL && !env.VERCEL_URL) {
		warnings.push(
			"NEXT_PUBLIC_SITE_URL is not set; using the default site URL for metadata.",
		);
	}

	return {
		url: siteUrl,
		urlString: siteUrl.toString(),
	};
};

const resolvePublisher = (env: RawEnv) => {
	const name = env.NEXT_PUBLIC_PUBLISHER_NAME ?? DEFAULTS.publisherName;

	if (!env.NEXT_PUBLIC_PUBLISHER_NAME) {
		warnings.push(
			"NEXT_PUBLIC_PUBLISHER_NAME is not set; falling back to the default publisher name.",
		);
	}

	const website =
		asOptionalUrl(
			env.NEXT_PUBLIC_PUBLISHER_WEBSITE,
			"NEXT_PUBLIC_PUBLISHER_WEBSITE",
		)?.toString() ?? DEFAULTS.publisherWebsite;

	if (!env.NEXT_PUBLIC_PUBLISHER_WEBSITE) {
		warnings.push(
			"NEXT_PUBLIC_PUBLISHER_WEBSITE is not set; using the default publisher website.",
		);
	}

	const repository =
		asOptionalUrl(
			env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL,
			"NEXT_PUBLIC_GITHUB_REPOSITORY_URL",
		)?.toString() ??
		asOptionalUrl(
			env.NEXT_PUBLIC_GITHUB_REPOSITORY,
			"NEXT_PUBLIC_GITHUB_REPOSITORY",
		)?.toString() ??
		DEFAULTS.repositoryUrl;

	if (
		!env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL &&
		!env.NEXT_PUBLIC_GITHUB_REPOSITORY
	) {
		warnings.push(
			"NEXT_PUBLIC_GITHUB_REPOSITORY_URL is not set; using the default repository URL in metadata.",
		);
	}

	return {
		name,
		website,
		repository,
	};
};

const resolveGemini = (env: RawEnv) => {
	if (!env.GEMINI_API_KEY) {
		warnings.push(
			"GEMINI_API_KEY is not set; AI assistant features will be disabled.",
		);
	}

	return {
		apiKey: env.GEMINI_API_KEY,
	};
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

const rawEnvResult = rawEnvSchema.safeParse(process.env);

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
	publisher: resolvePublisher(rawEnv),
	gemini: resolveGemini(rawEnv),
	defaults: {
		siteUrl: DEFAULTS.siteUrl,
		publisherName: DEFAULTS.publisherName,
		publisherWebsite: DEFAULTS.publisherWebsite,
		repositoryUrl: DEFAULTS.repositoryUrl,
	},
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
	publisher: z.object({
		name: z.string().min(1),
		website: z.url(),
		repository: z.url(),
	}),
	gemini: z.object({
		apiKey: z.string().min(1).optional(),
	}),
	defaults: z.object({
		siteUrl: z.url(),
		publisherName: z.string().min(1),
		publisherWebsite: z.url(),
		repositoryUrl: z.url(),
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
	publisher: freeze({
		name: data.publisher.name,
		website: data.publisher.website,
		repository: data.publisher.repository,
	}),
	gemini: freeze({
		apiKey: data.gemini.apiKey,
	}),
	defaults: freeze({
		siteUrl: data.defaults.siteUrl,
		publisherName: data.defaults.publisherName,
		publisherWebsite: data.defaults.publisherWebsite,
		repositoryUrl: data.defaults.repositoryUrl,
	}),
});

export type AppConfig = typeof appConfig;

export default appConfig;
