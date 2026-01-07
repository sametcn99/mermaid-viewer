"use client";

import React, { useState, useCallback } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	Alert,
	CircularProgress,
	Link,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	continueWithLocalMode,
	login,
	clearError,
	selectAuthLoading,
	selectAuthError,
} from "@/store/authSlice";
import { SocialLogin } from "./SocialLogin";

interface LoginDialogProps {
	open: boolean;
	onClose: () => void;
	onSwitchToRegister: () => void;
	onLoginSuccess?: () => void;
}

export default function LoginDialog({
	open,
	onClose,
	onSwitchToRegister,
	onLoginSuccess,
}: LoginDialogProps) {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [validationErrors, setValidationErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

	const handleClose = useCallback(() => {
		setEmail("");
		setPassword("");
		setShowPassword(false);
		setValidationErrors({});
		dispatch(clearError());
		onClose();
	}, [dispatch, onClose]);

	const handleContinueLocal = useCallback(() => {
		dispatch(continueWithLocalMode());
		handleClose();
	}, [dispatch, handleClose]);

	const validate = useCallback(() => {
		const errors: { email?: string; password?: string } = {};

		if (!email) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = "Please enter a valid email";
		}

		if (!password) {
			errors.password = "Password is required";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [email, password]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!validate()) return;

			const result = await dispatch(login({ email, password }));

			if (login.fulfilled.match(result)) {
				handleClose();
				onLoginSuccess?.();
			}
		},
		[dispatch, email, password, validate, handleClose, onLoginSuccess],
	);

	const handleSwitchToRegister = useCallback(() => {
		handleClose();
		onSwitchToRegister();
	}, [handleClose, onSwitchToRegister]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				component: "form",
				onSubmit: handleSubmit,
			}}
		>
			<DialogTitle>
				<Typography variant="h5" fontWeight={600}>
					Welcome Back
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Sign in to sync your diagrams
				</Typography>
			</DialogTitle>

			<DialogContent>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{/* <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={!!validationErrors.email}
						helperText={validationErrors.email}
						disabled={isLoading}
						fullWidth
						autoFocus
						autoComplete="email"
					/>

					<TextField
						label="Password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={!!validationErrors.password}
						helperText={validationErrors.password}
						disabled={isLoading}
						fullWidth
						autoComplete="current-password"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
										size="small"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box> */}


				<SocialLogin />

				<Box
					sx={{
						mt: 3,
						p: 2,
						border: 1,
						borderColor: "divider",
						borderRadius: 2,
						backgroundColor: "background.default",
						display: "flex",
						flexDirection: "column",
						gap: 1,
					}}
				>
					<Typography variant="subtitle2" fontWeight={700}>
						Continue without signing in
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Stay on this device using local storage only. Nothing is sent to the
						backend and diagrams will not sync across devices.
					</Typography>
					<Button
						variant="outlined"
						fullWidth
						onClick={handleContinueLocal}
						disabled={isLoading}
					>
						Continue using local storage
					</Button>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 3, flexDirection: "column", gap: 1 }}>
				{/* <Button
					type="submit"
					variant="contained"
					fullWidth
					disabled={isLoading}
					sx={{ height: 44 }}
				>
					{isLoading ? (
						<CircularProgress size={24} color="inherit" />
					) : (
						"Sign In"
					)}
				</Button>

				<Typography variant="body2" color="text.secondary">
					Don&apos;t have an account?{" "}
					<Link
						component="button"
						type="button"
						onClick={handleSwitchToRegister}
						sx={{ cursor: "pointer" }}
					>
						Sign up
					</Link>
				</Typography> */}
			</DialogActions>
		</Dialog>
	);
}
