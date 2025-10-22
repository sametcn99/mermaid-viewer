import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("cytoscape", () => {
	const createCollection = () => ({
		forEach: () => {},
		map: () => [] as unknown[],
		remove: () => {},
		boundingBox: () => ({ w: 0, h: 0 }),
		length: 0,
	});

	const cytoscape = Object.assign(
		() => ({
			layout: () => ({ run: () => {} }),
			destroy: () => {},
			ready: (callback?: (event?: unknown) => void) => {
				callback?.({});
			},
			nodes: () => createCollection(),
			edges: () => createCollection(),
			add: () => {},
			on: () => {},
			off: () => {},
			removeListener: () => {},
		}),
		{ use: () => {} },
	);

 return { default: cytoscape };
});

vi.mock("cytoscape-cose-bilkent", () => ({ default: () => ({}) }));

import mermaid from "mermaid";

import { DIAGRAM_TEMPLATES } from "..";

const templateCases = DIAGRAM_TEMPLATES.map((template) =>
	[template.id, template.code] as const,
);

beforeAll(() => {
	mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
});

describe("Mermaid templates", () => {
	it.each(templateCases)(
		"renders %s",
		async (templateId, templateCode) => {
			const container = document.createElement("div");
			document.body.appendChild(container);

			try {
				const { svg } = await mermaid.render(
					`template-${templateId}`,
					templateCode,
					container,
				);
				expect(svg).toBeTruthy();
			} finally {
				container.remove();
			}
		},
	);
});
