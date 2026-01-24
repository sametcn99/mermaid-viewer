import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://mermaid.sametcc.me";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/home",
				disallow: [
					"/api/",
					"/auth/",
					"/admin/",
					"/login",
					"/login",
					"/presentation",
					"/iframe",
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
