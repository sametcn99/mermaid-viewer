"use client";

declare global {
	interface Window {
		umami?: {
			track: (
				eventName: string,
				eventData?: Record<string, string | number>,
			) => void;
		};
	}
}

export const useAnalytics = () => {
	const track = (
		eventName: string,
		eventData?: Record<string, string | number>,
	) => {
		if (typeof window !== "undefined" && window.umami) {
			window.umami.track(eventName, eventData);
		}
	};

	return { track };
};
