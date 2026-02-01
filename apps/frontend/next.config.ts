import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable source maps in production for better debugging
	productionBrowserSourceMaps: process.env.DISABLE_SOURCE_MAPS !== "true",

	// Enable standalone output for Docker builds
	output: "standalone",

	// Explicitly define environment variables for client-side access
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	},

	// Optimize webpack configuration
	webpack: (config, { dev, isServer }) => {
		// Enable source maps in production only if not disabled
		if (!dev && !isServer && process.env.DISABLE_SOURCE_MAPS !== "true") {
			config.devtool = "source-map";
		}

		return config;
	},
};

export default nextConfig;
