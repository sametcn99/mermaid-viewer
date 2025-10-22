import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup-mermaid.ts"],
		server: {
			deps: {
				inline: ["mermaid", "cytoscape", "cytoscape-cose-bilkent"],
			},
		},
	},
});
