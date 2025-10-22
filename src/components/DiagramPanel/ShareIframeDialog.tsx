import { useEffect, useMemo, useState, type ChangeEvent, type FC } from "react";
import {
	Alert,
	Box,
	Button,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Stack,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { getMermaidCodeFromUrl } from "@/lib/url.utils";
import { encodeMermaid } from "@/lib/utils";
import {
	buildIframeOptionsQuery,
	DEFAULT_IFRAME_OPTIONS,
	isValidIframeBackground,
	type IframeOptions,
} from "@/lib/iframeOptions";

interface ShareIframeDialogProps {
	open: boolean;
	onClose: () => void;
}

const ShareIframeDialog: FC<ShareIframeDialogProps> = ({ open, onClose }) => {
	const [copiedLink, setCopiedLink] = useState(false);
	const [copiedEmbed, setCopiedEmbed] = useState(false);
	const [options, setOptions] = useState<IframeOptions>({
		...DEFAULT_IFRAME_OPTIONS,
	});
	const [encodedDiagram, setEncodedDiagram] = useState("");
	const [advancedOpen, setAdvancedOpen] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !open) return;
		setEncodedDiagram(encodeMermaid(getMermaidCodeFromUrl()));
		setCopiedLink(false);
		setCopiedEmbed(false);
	}, [open]);

	const resetCopyState = () => {
		setCopiedLink(false);
		setCopiedEmbed(false);
	};

	const validationErrors = useMemo(() => {
		const errors: Partial<Record<keyof IframeOptions, string>> = {};

		if (!isValidIframeBackground(options.background)) {
			errors.background = "Use a valid hex color code (e.g. #ffffff).";
		}
		if (options.minZoom >= options.maxZoom) {
			errors.maxZoom = "Maximum zoom must be greater than minimum zoom.";
		}
		if (
			options.initialZoom < options.minZoom ||
			options.initialZoom > options.maxZoom
		) {
			errors.initialZoom = `Initial zoom must be between ${options.minZoom} and ${options.maxZoom}.`;
		}

		return errors;
	}, [options]);

	const hasValidationError = Object.values(validationErrors).some(Boolean);

	const shareData = useMemo(() => {
		if (typeof window === "undefined") {
			return { shareUrl: "", embedCode: "" };
		}

		const baseUrl = new URL(`${window.location.origin}/iframe`);
		if (encodedDiagram) {
			baseUrl.searchParams.set("diagram", encodedDiagram);
		}

		const optionQuery = buildIframeOptionsQuery(options);
		if (optionQuery) {
			const params = new URLSearchParams(optionQuery);
			params.forEach((value, key) => {
				baseUrl.searchParams.set(key, value);
			});
		}

		const shareUrl = baseUrl.toString();

		return {
			shareUrl,
			embedCode: `<iframe src="${shareUrl}" width="600" height="400"></iframe>`,
		};
	}, [encodedDiagram, options]);

	const handleCopy = (text: string, type: "link" | "embed") => {
		if (hasValidationError) return;
		navigator.clipboard.writeText(text).then(() => {
			if (type === "link") {
				setCopiedLink(true);
				setTimeout(() => setCopiedLink(false), 2000);
			} else {
				setCopiedEmbed(true);
				setTimeout(() => setCopiedEmbed(false), 2000);
			}
		});
	};

	const handleBooleanOptionChange =
		(key: "enableZoom" | "enablePan" | "enablePinch") =>
		(_event: unknown, checked: boolean) => {
			resetCopyState();
			setOptions((prev) => ({ ...prev, [key]: checked }));
		};

	const handleNumericOptionChange =
		(key: "initialZoom" | "minZoom" | "maxZoom") =>
		(event: ChangeEvent<HTMLInputElement>) => {
			const nextValue = Number.parseFloat(event.target.value);
			resetCopyState();
			setOptions((prev) => ({
				...prev,
				[key]: Number.isFinite(nextValue) ? nextValue : prev[key],
			}));
		};

	const handleBackgroundChange = (event: ChangeEvent<HTMLInputElement>) => {
		resetCopyState();
		setOptions((prev) => ({ ...prev, background: event.target.value }));
	};

	const handleResetOptions = () => {
		resetCopyState();
		setOptions({ ...DEFAULT_IFRAME_OPTIONS });
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Share Iframe</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					<Box>
						<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
							Direct Link
						</Typography>
						<TextField
							fullWidth
							value={shareData.shareUrl}
							InputProps={{ readOnly: true }}
						/>
						<Button
							variant="outlined"
							onClick={() => handleCopy(shareData.shareUrl, "link")}
							sx={{ mt: 1 }}
							disabled={hasValidationError}
						>
							{copiedLink ? "Copied!" : "Copy Link"}
						</Button>
					</Box>

					<Box>
						<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
							Embed Code
						</Typography>
						<TextField
							fullWidth
							value={shareData.embedCode}
							InputProps={{ readOnly: true }}
							multiline
							minRows={2}
						/>
						<Button
							variant="outlined"
							onClick={() => handleCopy(shareData.embedCode, "embed")}
							sx={{ mt: 1 }}
							disabled={hasValidationError}
						>
							{copiedEmbed ? "Copied!" : "Copy Embed Code"}
						</Button>
					</Box>

					<Divider />

					<Box>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="subtitle1" fontWeight="bold">
								Embed Options
							</Typography>
							<Button
								variant="text"
								onClick={() => setAdvancedOpen((prev) => !prev)}
								size="small"
							>
								{advancedOpen ? "Hide options" : "Show options"}
							</Button>
						</Stack>
						<Collapse in={advancedOpen} timeout="auto" unmountOnExit>
							<Stack spacing={2} sx={{ mt: 2 }}>
								<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
									<FormControlLabel
										control={
											<Switch
												checked={options.enableZoom}
												onChange={handleBooleanOptionChange("enableZoom")}
											/>
										}
										label="Allow zoom"
									/>
									<FormControlLabel
										control={
											<Switch
												checked={options.enablePan}
												onChange={handleBooleanOptionChange("enablePan")}
											/>
										}
										label="Allow pan"
									/>
									<FormControlLabel
										control={
											<Switch
												checked={options.enablePinch}
												onChange={handleBooleanOptionChange("enablePinch")}
											/>
										}
										label="Allow pinch"
									/>
								</Stack>

								<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
									<TextField
										label="Initial zoom"
										type="number"
										value={options.initialZoom}
										onChange={handleNumericOptionChange("initialZoom")}
										inputProps={{ step: 0.1, min: 0.05 }}
										error={Boolean(validationErrors.initialZoom)}
										helperText={
											validationErrors.initialZoom ||
											"Starting scale when the iframe loads."
										}
									/>
									<TextField
										label="Minimum zoom"
										type="number"
										value={options.minZoom}
										onChange={handleNumericOptionChange("minZoom")}
										inputProps={{ step: 0.1, min: 0.05 }}
										error={Boolean(validationErrors.maxZoom)}
										helperText={
											validationErrors.maxZoom ||
											"Lowest scale users can zoom out to."
										}
									/>
									<TextField
										label="Maximum zoom"
										type="number"
										value={options.maxZoom}
										onChange={handleNumericOptionChange("maxZoom")}
										inputProps={{ step: 0.1, min: 0.1 }}
										error={Boolean(validationErrors.maxZoom)}
										helperText={
											validationErrors.maxZoom ||
											"Highest scale users can zoom into."
										}
									/>
								</Stack>

								<Stack
									direction={{ xs: "column", sm: "row" }}
									spacing={2}
									alignItems="center"
								>
									<TextField
										label="Background color"
										type="color"
										value={options.background}
										onChange={handleBackgroundChange}
										InputLabelProps={{ shrink: true }}
										sx={{ width: { xs: "100%", sm: 160 } }}
										error={Boolean(validationErrors.background)}
										helperText={
											validationErrors.background ||
											"Pick a hex color for the iframe background."
										}
									/>
									<TextField
										label="Color value"
										value={options.background}
										onChange={handleBackgroundChange}
										error={Boolean(validationErrors.background)}
										helperText={
											validationErrors.background
												? ""
												: "Hex code used in the iframe URL."
										}
									/>
								</Stack>

								<Stack direction="row" justifyContent="flex-end">
									<Button onClick={handleResetOptions} size="small">
										Reset to defaults
									</Button>
								</Stack>

								{hasValidationError && (
									<Alert severity="warning">
										Fix the highlighted options to enable sharing.
									</Alert>
								)}
							</Stack>
						</Collapse>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ShareIframeDialog;
