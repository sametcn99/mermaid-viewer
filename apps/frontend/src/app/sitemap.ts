import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://mermaid.sametcc.me";

	return [
		{
			url: baseUrl[baseUrl.length - 1] === "/" ? baseUrl.slice(0, -1) : baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
