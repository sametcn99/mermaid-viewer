import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable source maps in production for better debugging
	productionBrowserSourceMaps: process.env.DISABLE_SOURCE_MAPS !== "true",

	// Enable standalone output for Docker builds
	output: "standalone",

	// Experimental options to control build resource usage
	experimental: {
		// Limit workers during build to avoid OOM on limited hardware (e.g. CI/CD, Docker)
		cpus: process.env.BUILD_CPU_LIMIT
			? Number.parseInt(process.env.BUILD_CPU_LIMIT)
			: undefined,
	},

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
