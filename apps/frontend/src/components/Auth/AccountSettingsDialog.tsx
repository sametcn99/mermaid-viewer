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
	Divider,
	InputAdornment,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import { Eye, EyeOff, ChevronDown, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	updateProfile,
	logout,
	clearError,
	selectUser,
	selectAuthLoading,
	selectAuthError,
} from "@/store/authSlice";
import { deleteAccount } from "@/lib/api";

interface AccountSettingsDialogProps {
	open: boolean;
	onClose: () => void;
}

export default function AccountSettingsDialog({
	open,
	onClose,
}: AccountSettingsDialogProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isLoading = useAppSelector(selectAuthLoading);
	const error = useAppSelector(selectAuthError);

	const [displayName, setDisplayName] = useState(user?.displayName || "");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPasswords, setShowPasswords] = useState(false);
	const [deletePassword, setDeletePassword] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<{
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
		deletePassword?: string;
	}>({});

	const handleClose = useCallback(() => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setShowPasswords(false);
		setDeletePassword("");
		setDeleteError(null);
		setSuccess(null);
		setValidationErrors({});
		dispatch(clearError());
		onClose();
	}, [dispatch, onClose]);

	// Reset form when dialog opens
	React.useEffect(() => {
		if (open && user) {
			setDisplayName(user.displayName || "");
		}
	}, [open, user]);

	const validateProfile = useCallback(() => {
		const errors: typeof validationErrors = {};

		// If changing password, validate password fields
		if (newPassword || currentPassword) {
			if (!currentPassword) {
				errors.currentPassword = "Current password is required";
			}
			if (!newPassword) {
				errors.newPassword = "New password is required";
			} else if (newPassword.length < 8) {
				errors.newPassword = "Password must be at least 8 characters";
			}
			if (newPassword && newPassword !== confirmPassword) {
				errors.confirmPassword = "Passwords do not match";
			}
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	}, [currentPassword, newPassword, confirmPassword]);

	const handleUpdateProfile = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (!validateProfile()) return;

			const updates: {
				displayName?: string;
				currentPassword?: string;
				newPassword?: string;
			} = {};

			if (displayName !== user?.displayName) {
				updates.displayName = displayName.trim() || undefined;
			}

			if (newPassword && currentPassword) {
				updates.currentPassword = currentPassword;
				updates.newPassword = newPassword;
			}

			if (Object.keys(updates).length === 0) {
				setSuccess("No changes to save");
				return;
			}

			const result = await dispatch(updateProfile(updates));

			if (updateProfile.fulfilled.match(result)) {
				setSuccess("Profile updated successfully");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		},
		[
			dispatch,
			displayName,
			currentPassword,
			newPassword,
			user?.displayName,
			validateProfile,
		],
	);

	const handleDeleteAccount = useCallback(async () => {
		if (!deletePassword) {
			setValidationErrors({ deletePassword: "Password is required" });
			return;
		}

		setIsDeleting(true);
		setDeleteError(null);

		try {
			await deleteAccount(deletePassword);
			await dispatch(logout());
			handleClose();
		} catch (err) {
			setDeleteError(
				err instanceof Error ? err.message : "Failed to delete account",
			);
		} finally {
			setIsDeleting(false);
		}
	}, [deletePassword, dispatch, handleClose]);

	if (!user) return null;

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Typography variant="h5" fontWeight={600}>
					Account Settings
				</Typography>
			</DialogTitle>

			<DialogContent>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity="success" sx={{ mb: 2 }}>
						{success}
					</Alert>
				)}

				<Box
					component="form"
					onSubmit={handleUpdateProfile}
					sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
				>
					<TextField
						label="Email"
						value={user.email}
						disabled
						fullWidth
						helperText="Email cannot be changed"
					/>

					<TextField
						label="Display Name"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						disabled={isLoading}
						fullWidth
					/>

					<Divider sx={{ my: 1 }}>
						<Typography variant="caption" color="text.secondary">
							Change Password
						</Typography>
					</Divider>

					<TextField
						label="Current Password"
						type={showPasswords ? "text" : "password"}
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						error={!!validationErrors.currentPassword}
						helperText={validationErrors.currentPassword}
						disabled={isLoading}
						fullWidth
						autoComplete="current-password"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPasswords(!showPasswords)}
										edge="end"
										size="small"
										tabIndex={-1}
									>
										{showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<TextField
						label="New Password"
						type={showPasswords ? "text" : "password"}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						error={!!validationErrors.newPassword}
						helperText={validationErrors.newPassword || "At least 8 characters"}
						disabled={isLoading}
						fullWidth
						autoComplete="new-password"
					/>

					<TextField
						label="Confirm New Password"
						type={showPasswords ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						error={!!validationErrors.confirmPassword}
						helperText={validationErrors.confirmPassword}
						disabled={isLoading}
						fullWidth
						autoComplete="new-password"
					/>

					<Button
						type="submit"
						variant="contained"
						disabled={isLoading}
						sx={{ mt: 1 }}
					>
						{isLoading ? <CircularProgress size={24} /> : "Save Changes"}
					</Button>
				</Box>

				<Accordion
					sx={{ mt: 3, bgcolor: "error.main", color: "error.contrastText" }}
				>
					<AccordionSummary
						expandIcon={<ChevronDown color="white" />}
						sx={{
							"& .MuiAccordionSummary-content": {
								alignItems: "center",
								gap: 1,
							},
						}}
					>
						<AlertTriangle size={20} />
						<Typography fontWeight={500}>Danger Zone</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ bgcolor: "background.paper" }}>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Deleting your account will permanently remove all your data,
							including diagrams, templates, and settings. This action cannot be
							undone.
						</Typography>

						{deleteError && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{deleteError}
							</Alert>
						)}

						<TextField
							label="Enter your password to confirm"
							type="password"
							value={deletePassword}
							onChange={(e) => setDeletePassword(e.target.value)}
							error={!!validationErrors.deletePassword}
							helperText={validationErrors.deletePassword}
							disabled={isDeleting}
							fullWidth
							size="small"
							sx={{ mb: 2 }}
						/>

						<Button
							variant="contained"
							color="error"
							onClick={handleDeleteAccount}
							disabled={isDeleting || !deletePassword}
							fullWidth
						>
							{isDeleting ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								"Delete My Account"
							)}
						</Button>
					</AccordionDetails>
				</Accordion>
			</DialogContent>

			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button onClick={handleClose} variant="outlined">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
