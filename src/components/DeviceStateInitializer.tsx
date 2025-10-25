"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import {
	detectTouchDevice,
	measureScreenSize,
	syncTouchDeviceFromMedia,
} from "@/store/deviceSlice";

export default function DeviceStateInitializer() {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (typeof window === "undefined") return;

		dispatch(detectTouchDevice());

		const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
		const handleChange = (event: MediaQueryListEvent) => {
			dispatch(syncTouchDeviceFromMedia(event.matches));
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [dispatch]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		dispatch(measureScreenSize());

		const updateScreenSize = () => {
			dispatch(measureScreenSize());
		};

		window.addEventListener("resize", updateScreenSize);
		window.addEventListener("orientationchange", updateScreenSize);

		return () => {
			window.removeEventListener("resize", updateScreenSize);
			window.removeEventListener("orientationchange", updateScreenSize);
		};
	}, [dispatch]);

	return null;
}
