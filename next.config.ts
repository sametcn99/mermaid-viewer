import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable source maps in production for better debugging
	productionBrowserSourceMaps: true,

	// Enable standalone output for Docker builds
	output: "standalone",

	// Optimize webpack configuration
	webpack: (config, { dev, isServer }) => {
		// Enable source maps in production
		if (!dev && !isServer) {
			config.devtool = "source-map";
		}

		return config;
	},
};

export default nextConfig;
