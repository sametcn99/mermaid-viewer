import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Disable source maps in production by default to improve build performance
	// Set ENABLE_SOURCE_MAPS=true to enable them for debugging
	productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === "true",

	// Enable standalone output for Docker builds
	output: "standalone",

	// Explicitly define environment variables for client-side access
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	},

	// Optimize webpack configuration
	webpack: (config) => {
		return config;
	},
};

export default nextConfig;
