import appConfig from "@/lib/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = appConfig.site.urlString;

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/privacy", "/terms"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
