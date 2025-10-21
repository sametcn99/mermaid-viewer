import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://mermaid-viewer-alpha.vercel.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
