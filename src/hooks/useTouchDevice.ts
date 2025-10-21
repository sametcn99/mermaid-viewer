"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the user is on a touch device
 * @returns boolean indicating if the device supports touch
 */
export function useTouchDevice(): boolean {
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		// Check if touch is supported
		const checkTouchSupport = () => {
			return (
				"ontouchstart" in window ||
				navigator.maxTouchPoints > 0 ||
				// @ts-expect-error - for older browsers
				navigator.msMaxTouchPoints > 0
			);
		};

		setIsTouchDevice(checkTouchSupport());

		// Also listen for changes (in case of hybrid devices)
		const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
		const handleChange = (e: MediaQueryListEvent) => {
			setIsTouchDevice(e.matches || checkTouchSupport());
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return isTouchDevice;
}

/**
 * Hook to detect screen size for mobile optimizations
 * @returns object with screen size information
 */
export function useScreenSize() {
	const [screenSize, setScreenSize] = useState({
		isMobile: false,
		isTablet: false,
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const updateScreenSize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			setScreenSize({
				width,
				height,
				isMobile: width < 768,
				isTablet: width >= 768 && width < 1024,
			});
		};

		updateScreenSize();
		window.addEventListener("resize", updateScreenSize);
		window.addEventListener("orientationchange", updateScreenSize);

		return () => {
			window.removeEventListener("resize", updateScreenSize);
			window.removeEventListener("orientationchange", updateScreenSize);
		};
	}, []);

	return screenSize;
}

/**
 * Combined hook for touch and mobile detection
 */
export function useMobileTouch() {
	const isTouchDevice = useTouchDevice();
	const screenSize = useScreenSize();

	return {
		isTouchDevice,
		...screenSize,
		isMobileTouch: isTouchDevice && screenSize.isMobile,
	};
}
