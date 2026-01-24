import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://mermaid.sametcc.me";

	return [
		{
			url: `${baseUrl}/home`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
	];
}
