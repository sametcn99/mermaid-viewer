"use client";

import type React from "react";
import { useState, useCallback } from "react";
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
	register,
	clearError,
	selectAuthLoading,
	selectAuthError,
} from "@/store/authSlice";

interface RegisterDialogProps {
	open: boolean;
	onClose: () => void;
	onSwitchToLogin: () => void;
	onRegisterSuccess?: () => void;
}

export default function RegisterDialog({
	open,
	onClose,
	onSwitchToLogin,
	onRegisterSuccess,
}: RegisterDialogProps) {
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);

	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [validationErrors, setValidationErrors] = useState<{
		displayName?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const handleClose = useCallback(() => {
		setDisplayName("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setShowPassword(false);
		setValidationErrors({});
		dispatch(clearError());
		onClose();
	}, [dispatch, onClose]);

	const validate = useCallback(() => {
		const errors: {
			displayName?: string;
			email?: string;
			password?: string;
			confirmPassword?: string;
		} = {};

		if (!email) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = "Please enter a valid email";
		}

		if (!password) {
			errors.password = "Password is required";
		} else if (password.length < 8) {
			errors.password = "Password must be at least 8 characters";
		}

		if (!confirmPassword) {
			errors.confirmPassword = "Please confirm your password";
		} else if (password !== confirmPassword) {
			errors.confirmPassword = "Passwords do not match";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [email, password, confirmPassword]);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!validate()) return;

			const result = await dispatch(
				register({
					email,
					password,
					displayName: displayName.trim() || undefined,
				}),
			);

			if (register.fulfilled.match(result)) {
				handleClose();
				onRegisterSuccess?.();
			}
		},
		[
			dispatch,
			email,
			password,
			displayName,
			validate,
			handleClose,
			onRegisterSuccess,
		],
	);

	const handleSwitchToLogin = useCallback(() => {
		handleClose();
		onSwitchToLogin();
	}, [handleClose, onSwitchToLogin]);

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
					Create Account
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Sign up to save and sync your diagrams
				</Typography>
			</DialogTitle>

			<DialogContent>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
					<TextField
						label="Display Name"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						error={!!validationErrors.displayName}
						helperText={validationErrors.displayName || "Optional"}
						disabled={isLoading}
						fullWidth
						autoFocus
						autoComplete="name"
					/>

					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={!!validationErrors.email}
						helperText={validationErrors.email}
						disabled={isLoading}
						fullWidth
						required
						autoComplete="email"
					/>

					<TextField
						label="Password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={!!validationErrors.password}
						helperText={validationErrors.password || "At least 8 characters"}
						disabled={isLoading}
						fullWidth
						required
						autoComplete="new-password"
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

					<TextField
						label="Confirm Password"
						type={showPassword ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						error={!!validationErrors.confirmPassword}
						helperText={validationErrors.confirmPassword}
						disabled={isLoading}
						fullWidth
						required
						autoComplete="new-password"
					/>
				</Box>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 3, flexDirection: "column", gap: 1 }}>
				<Button
					type="submit"
					variant="contained"
					fullWidth
					disabled={isLoading}
					sx={{ height: 44 }}
				>
					{isLoading ? (
						<CircularProgress size={24} color="inherit" />
					) : (
						"Create Account"
					)}
				</Button>

				<Typography variant="body2" color="text.secondary">
					Already have an account?{" "}
					<Link
						component="button"
						type="button"
						onClick={handleSwitchToLogin}
						sx={{ cursor: "pointer" }}
					>
						Sign in
					</Link>
				</Typography>
			</DialogActions>
		</Dialog>
	);
}
