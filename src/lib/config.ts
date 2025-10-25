import { z } from "zod";

const DEFAULTS = Object.freeze({
	siteUrl: "https://mermaid.sametcc.me",
	publisherName: "sametcn99",
	publisherWebsite: "https://sametcc.me",
	repositoryUrl: "https://github.com/sametcn99/mermaid-viewer",
});

const optionalEnv = z
	.string()
	.optional()
	.transform((value) => value?.trim() || undefined);

const rawEnvSchema = z
	.object({
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

const resolveSite = (env: RawEnv) => {
	const siteUrl =
		ensureAbsoluteUrl(env.NEXT_PUBLIC_SITE_URL) ??
		ensureAbsoluteUrl(env.VERCEL_URL) ??
		new URL(DEFAULTS.siteUrl);

	return {
		url: siteUrl,
		urlString: siteUrl.toString(),
	};
};

const resolvePublisher = (env: RawEnv) => {
	const name = env.NEXT_PUBLIC_PUBLISHER_NAME ?? DEFAULTS.publisherName;

	const website =
		ensureAbsoluteUrl(env.NEXT_PUBLIC_PUBLISHER_WEBSITE)?.toString() ??
		DEFAULTS.publisherWebsite;

	const repository =
		ensureAbsoluteUrl(env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL)?.toString() ??
		ensureAbsoluteUrl(env.NEXT_PUBLIC_GITHUB_REPOSITORY)?.toString() ??
		DEFAULTS.repositoryUrl;

	return {
		name,
		website,
		repository,
	};
};

const resolveGemini = (env: RawEnv) => ({
	apiKey: env.GEMINI_API_KEY,
});

const rawEnv = rawEnvSchema.parse(process.env);

const computedConfig = {
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

export const appConfig = freeze({
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
