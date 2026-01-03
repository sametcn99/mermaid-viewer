import appConfig from "@/lib/config";

export async function GET() {
	const baseUrl = appConfig.site.urlString;
	const siteUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

	const lastModified = new Date().toISOString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}
