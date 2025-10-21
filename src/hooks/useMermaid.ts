"use client";

import {
	findMatchingDiagramId,
	getAllDiagramsFromStorage,
	type SavedDiagram,
	updateDiagram,
} from "@/lib/storage.utils";
import {
	getMermaidCodeFromUrl,
	updateUrlWithMermaidCode,
} from "@/lib/url.utils";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";

const initialMermaidCode = `graph TD
  A[Start] --> B{Is it Friday?};
  B -- Yes --> C[Party!];
  B -- No --> D[Code];
  D --> E[Coffee];
  E --> D;
  C --> F[Sleep];
`;

export interface UseMermaidReturn {
	mermaidCode: string;
	debouncedCode: string;
	hasUnsavedChanges: boolean;
	currentDiagramId?: string;
	openLoadDialog: boolean;
	alertMessage: string | null;
	handleEditorChange: (value: string | undefined) => void;
	handleLoadDiagram: (diagram: SavedDiagram) => void;
	handleNewDiagram: () => void;
	handleSaveDiagram: (diagramId: string | undefined) => void;
	handleCloseLoadDialog: () => void;
	handleAlertClose: () => void;
	setOpenLoadDialog: (open: boolean) => void;
	setAlertMessage: (message: string | null) => void;
	setCurrentDiagramId: (id: string | undefined) => void;
	setHasUnsavedChanges: (changed: boolean) => void;
}

export const useMermaid = (): UseMermaidReturn => {
	const [mermaidCode, setMermaidCode] = useState<string>("");
	const [debouncedCode, setDebouncedCode] = useState<string>("");
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
	const [currentDiagramId, setCurrentDiagramId] = useState<string | undefined>(
		undefined,
	);
	const [openLoadDialog, setOpenLoadDialog] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);

	// Load initial diagram from URL or local storage or use default
	useEffect(() => {
		const codeFromUrl = getMermaidCodeFromUrl();

		if (codeFromUrl) {
			setMermaidCode(codeFromUrl);
			setDebouncedCode(codeFromUrl);
			const matchedId = findMatchingDiagramId(codeFromUrl);
			if (matchedId) {
				setCurrentDiagramId(matchedId);
				setHasUnsavedChanges(false);
			}
			return;
		}

		const savedDiagrams = getAllDiagramsFromStorage();
		if (savedDiagrams.length > 0) {
			setOpenLoadDialog(true);
		} else {
			setMermaidCode(initialMermaidCode);
			setDebouncedCode(initialMermaidCode);
			updateUrlWithMermaidCode(initialMermaidCode);
		}
	}, []);

	const debouncedSetDiagramCode = useMemo(
		() =>
			debounce((code: string) => {
				setDebouncedCode(code);
			}, 300),
		[],
	);

	const handleEditorChange = (value: string | undefined) => {
		const newCode = value || "";
		setMermaidCode(newCode);
		debouncedSetDiagramCode(newCode);

		if (currentDiagramId) {
			const savedDiagrams = getAllDiagramsFromStorage();
			const currentSaved = savedDiagrams.find((d) => d.id === currentDiagramId);
			if (currentSaved && currentSaved.code !== newCode) {
				setHasUnsavedChanges(true);
			} else {
				setHasUnsavedChanges(false);
			}
		} else if (newCode !== initialMermaidCode) {
			setHasUnsavedChanges(true);
		}
	};

	const handleLoadDiagram = (diagram: SavedDiagram) => {
		setMermaidCode(diagram.code);
		setDebouncedCode(diagram.code);
		setCurrentDiagramId(diagram.id);
		updateUrlWithMermaidCode(diagram.code);
		setHasUnsavedChanges(false);
		setAlertMessage(`Loaded diagram: ${diagram.name}`);
	};

	const handleNewDiagram = () => {
		setMermaidCode(initialMermaidCode);
		setDebouncedCode(initialMermaidCode);
		setCurrentDiagramId(undefined);
		updateUrlWithMermaidCode(initialMermaidCode);
		setHasUnsavedChanges(false);
		setAlertMessage("Created new diagram");
	};

	const handleSaveDiagram = (diagramId: string | undefined) => {
		if (diagramId) {
			const updated = updateDiagram(diagramId, { code: mermaidCode });
			if (updated) {
				setHasUnsavedChanges(false);
				setAlertMessage("Diagram updated");
			}
		}
	};

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				const message =
					"You have unsaved changes. Are you sure you want to leave?";
				event.preventDefault();
				event.returnValue = message;
				return message;
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	useEffect(() => {
		return () => {
			debouncedSetDiagramCode.cancel();
		};
	}, [debouncedSetDiagramCode]);

	const handleCloseLoadDialog = () => {
		setOpenLoadDialog(false);
		if (!currentDiagramId && mermaidCode === "") {
			setMermaidCode(initialMermaidCode);
			setDebouncedCode(initialMermaidCode);
			updateUrlWithMermaidCode(initialMermaidCode);
		}
	};

	const handleAlertClose = () => {
		setAlertMessage(null);
	};

	return {
		mermaidCode,
		debouncedCode,
		hasUnsavedChanges,
		currentDiagramId,
		openLoadDialog,
		alertMessage,
		handleEditorChange,
		handleLoadDiagram,
		handleNewDiagram,
		handleSaveDiagram,
		handleCloseLoadDialog,
		handleAlertClose,
		setOpenLoadDialog,
		setAlertMessage,
		setCurrentDiagramId,
		setHasUnsavedChanges,
	};
};
