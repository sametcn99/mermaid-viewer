const DEFAULT_BBOX = { x: 0, y: 0, width: 100, height: 20 } as const;

type AnyProto = Record<PropertyKey, unknown>;

const ensureMethod = (
	proto: unknown,
	method: PropertyKey,
	implementation: unknown,
) => {
	if (!proto) return;
	const target = proto as AnyProto;
	if (target[method] !== undefined) return;

	Reflect.defineProperty(target, method, {
		configurable: true,
		enumerable: false,
		value: implementation,
		writable: true,
	});
};

const svgElementProto = (globalThis as { SVGElement?: typeof SVGElement }).SVGElement?.prototype;

ensureMethod(svgElementProto, "getBBox", function getBBox() {
	return { ...DEFAULT_BBOX };
});

ensureMethod(svgElementProto, "getComputedTextLength", function getComputedTextLength() {
	return DEFAULT_BBOX.width;
});

ensureMethod(svgElementProto, "getCTM", function getCTM() {
	return new DOMMatrix();
});

ensureMethod(svgElementProto, "getScreenCTM", function getScreenCTM() {
	return new DOMMatrix();
});

const svgTextProto = (globalThis as { SVGTextContentElement?: typeof SVGTextContentElement })
	.SVGTextContentElement?.prototype;

ensureMethod(svgTextProto, "getBBox", function getBBox() {
	return { ...DEFAULT_BBOX };
});

ensureMethod(svgTextProto, "getComputedTextLength", function getComputedTextLength() {
	return DEFAULT_BBOX.width;
});

const canvasProto = (globalThis as { HTMLCanvasElement?: typeof HTMLCanvasElement })
	.HTMLCanvasElement?.prototype;

if (canvasProto) {
	Reflect.defineProperty(canvasProto, "getContext", {
		configurable: true,
		enumerable: false,
		value: function getContext() {
			const fakeContext = {
				canvas: this,
				clearRect: () => {},
				fillRect: () => {},
				getImageData: () => ({ data: [] }),
				putImageData: () => {},
				createImageData: () => ({ data: [] }),
				save: () => {},
				restore: () => {},
				beginPath: () => {},
				moveTo: () => {},
				lineTo: () => {},
				closePath: () => {},
				stroke: () => {},
				translate: () => {},
				scale: () => {},
				rotate: () => {},
				arc: () => {},
				fill: () => {},
				setTransform: () => {},
				transform: () => {},
				setLineDash: () => {},
				measureText: () => ({ width: DEFAULT_BBOX.width }),
				font: "",
			};
			return fakeContext as unknown as CanvasRenderingContext2D;
		},
		writable: true,
	});
}
