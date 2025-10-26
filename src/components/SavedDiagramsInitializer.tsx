"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { refreshSavedDiagrams } from "@/store/savedDiagramsSlice";

export default function SavedDiagramsInitializer() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (typeof window === "undefined") return;

		void dispatch(refreshSavedDiagrams());

		const handleDiagramsChange = () => {
			void dispatch(refreshSavedDiagrams());
		};

		window.addEventListener("diagramsChanged", handleDiagramsChange);

		return () => {
			window.removeEventListener("diagramsChanged", handleDiagramsChange);
		};
	}, [dispatch]);

	return null;
}
