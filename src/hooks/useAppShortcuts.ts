import { useEffect, useMemo, useState } from "react";

export interface AppShortcutLabels {
	newDiagram: string;
	openTemplates: string;
	openSaved: string;
	saveDiagram: string;
	presentation: string;
	help: string;
}

interface ShortcutDefinition {
	label: string;
	matches: (event: KeyboardEvent) => boolean;
}

const macPlatformPattern = /mac|ipad|iphone|ipod/;

const getPlatformFlags = () => {
	if (typeof window === "undefined") {
		return { isMac: false, isLinux: false };
	}

	const platform = window.navigator.platform.toLowerCase();

	return {
		isMac: macPlatformPattern.test(platform),
		isLinux: platform.includes("linux"),
	};
};

const createShortcutDefinitions = (isMac: boolean, isLinux: boolean) => {
	const primaryLabel = isMac ? "⌘" : "Ctrl";
	const altLabel = isMac ? "⌥" : "Alt";

	const isPrimaryPressed = (event: KeyboardEvent) =>
		isMac ? event.metaKey : event.ctrlKey;

	const withPreventDefault = (
		event: KeyboardEvent,
		handler: () => void,
		start?: () => void,
	) => {
		event.preventDefault();
		event.stopPropagation();
		start?.();
		handler();
	};

	const newDiagram: ShortcutDefinition = isMac
		? {
				label: `${primaryLabel}+${altLabel}+N`,
				matches: (event) =>
					event.metaKey && event.altKey && event.key.toLowerCase() === "n",
			}
		: isLinux
			? {
					label: `${primaryLabel}+${altLabel}+Shift+N`,
					matches: (event) =>
						event.ctrlKey &&
						event.altKey &&
						event.shiftKey &&
						event.key.toLowerCase() === "n",
				}
			: {
					label: `${primaryLabel}+${altLabel}+N`,
					matches: (event) =>
						event.ctrlKey && event.altKey && event.key.toLowerCase() === "n",
				};

	const openTemplates: ShortcutDefinition = isMac
		? {
				label: `${primaryLabel}+${altLabel}+T`,
				matches: (event) =>
					event.metaKey && event.altKey && event.key.toLowerCase() === "t",
			}
		: isLinux
			? {
					label: `${primaryLabel}+${altLabel}+Shift+T`,
					matches: (event) =>
						event.ctrlKey &&
						event.altKey &&
						event.shiftKey &&
						event.key.toLowerCase() === "t",
				}
			: {
					label: `${primaryLabel}+${altLabel}+T`,
					matches: (event) =>
						event.ctrlKey && event.altKey && event.key.toLowerCase() === "t",
				};

	const openSaved: ShortcutDefinition = {
		label: `${primaryLabel}+O`,
		matches: (event) =>
			isPrimaryPressed(event) &&
			!event.altKey &&
			!event.shiftKey &&
			event.key.toLowerCase() === "o",
	};

	const saveDiagram: ShortcutDefinition = {
		label: `${primaryLabel}+S`,
		matches: (event) =>
			isPrimaryPressed(event) &&
			!event.altKey &&
			!event.shiftKey &&
			event.key.toLowerCase() === "s",
	};

	const presentation: ShortcutDefinition = {
		label: `${primaryLabel}+P`,
		matches: (event) =>
			isPrimaryPressed(event) &&
			!event.altKey &&
			!event.shiftKey &&
			event.key.toLowerCase() === "p",
	};

	const help: ShortcutDefinition = {
		label: "F1",
		matches: (event) => event.key === "F1",
	};

	return {
		primaryLabel,
		altLabel,
		withPreventDefault,
		newDiagram,
		openTemplates,
		openSaved,
		saveDiagram,
		presentation,
		help,
	};
};

export interface UseAppShortcutsParams {
	onShortcutStart?: () => void;
	onNewDiagram: () => void;
	onOpenTemplates: () => void;
	onOpenSaved: () => void;
	onSaveDiagram: () => void;
	onEnterPresentation: () => void;
	onOpenHelp: () => void;
}

export const useAppShortcuts = ({
	onShortcutStart,
	onNewDiagram,
	onOpenTemplates,
	onOpenSaved,
	onSaveDiagram,
	onEnterPresentation,
	onOpenHelp,
}: UseAppShortcutsParams): AppShortcutLabels => {
	const [{ isMac, isLinux }, setPlatformFlags] = useState(() =>
		getPlatformFlags(),
	);

	useEffect(() => {
		setPlatformFlags(getPlatformFlags());
	}, []);

	const definitions = useMemo(
		() => createShortcutDefinitions(isMac, isLinux),
		[isMac, isLinux],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const {
				newDiagram,
				openTemplates,
				openSaved,
				saveDiagram,
				presentation,
				help,
				withPreventDefault,
			} = definitions;

			if (newDiagram.matches(event)) {
				withPreventDefault(event, onNewDiagram, onShortcutStart);
				return;
			}

			if (openTemplates.matches(event)) {
				withPreventDefault(event, onOpenTemplates, onShortcutStart);
				return;
			}

			if (openSaved.matches(event)) {
				withPreventDefault(event, onOpenSaved, onShortcutStart);
				return;
			}

			if (saveDiagram.matches(event)) {
				withPreventDefault(event, onSaveDiagram, onShortcutStart);
				return;
			}

			if (presentation.matches(event)) {
				withPreventDefault(event, onEnterPresentation, onShortcutStart);
				return;
			}

			if (help.matches(event)) {
				withPreventDefault(event, onOpenHelp, onShortcutStart);
			}
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => window.removeEventListener("keydown", handleKeyDown, true);
	}, [
		definitions,
		onEnterPresentation,
		onNewDiagram,
		onOpenHelp,
		onOpenSaved,
		onOpenTemplates,
		onSaveDiagram,
		onShortcutStart,
	]);

	return useMemo(
		() => ({
			newDiagram: definitions.newDiagram.label,
			openTemplates: definitions.openTemplates.label,
			openSaved: definitions.openSaved.label,
			saveDiagram: definitions.saveDiagram.label,
			presentation: definitions.presentation.label,
			help: definitions.help.label,
		}),
		[definitions],
	);
};
