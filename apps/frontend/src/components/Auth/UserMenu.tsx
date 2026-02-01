"use client";

import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@mui/material";
import { HardDrive, LogIn, LogOut, Settings } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
	logout,
	selectAuthLoading,
	selectIsLocalOnly,
	selectUser,
} from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface UserMenuProps {
	onOpenSettings?: () => void;
	onSignIn?: () => void;
}

export default function UserMenu({ onOpenSettings, onSignIn }: UserMenuProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isLocalOnly = useAppSelector(selectIsLocalOnly);
	const isLoading = useAppSelector(selectAuthLoading);
	const { track } = useAnalytics();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, []);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, []);

	const handleLogout = useCallback(async () => {
		track("logout_click");
		handleClose();
		await dispatch(logout());
	}, [dispatch, handleClose, track]);

	const handleSettings = useCallback(() => {
		handleClose();
		onOpenSettings?.();
	}, [handleClose, onOpenSettings]);

	const handleSignIn = useCallback(() => {
		track("signin_menu_click");
		handleClose();
		onSignIn?.();
	}, [handleClose, onSignIn, track]);

	if (!user && !isLocalOnly) return null;

	const displayName = user
		? user.displayName || user.email.split("@")[0]
		: "Local User";
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<>
			<Tooltip title={user ? "Account" : "Local Account"}>
				<IconButton
					onClick={handleOpen}
					size="small"
					aria-controls={open ? "account-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
					disabled={isLoading}
				>
					<Avatar
						sx={{
							width: 32,
							height: 32,
							fontSize: "0.875rem",
							bgcolor: isLocalOnly ? "action.active" : "primary.main",
						}}
					>
						{isLocalOnly ? <HardDrive size={16} /> : initials}
					</Avatar>
				</IconButton>
			</Tooltip>

			<Menu
				id="account-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				slotProps={{
					paper: {
						sx: { minWidth: 220, mt: 1 },
					},
				}}
			>
				<Box sx={{ px: 2, py: 1.5 }}>
					<Typography variant="subtitle2" fontWeight={600}>
						{displayName}
					</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>
						{user ? user.email : "Local storage"}
					</Typography>
				</Box>

				<Divider />

				{onOpenSettings && (
					<MenuItem onClick={handleSettings}>
						<ListItemIcon>
							<Settings size={18} />
						</ListItemIcon>
						<ListItemText>Account Settings</ListItemText>
					</MenuItem>
				)}

				<Divider />

				{user ? (
					<MenuItem onClick={handleLogout} disabled={isLoading}>
						<ListItemIcon>
							<LogOut size={18} />
						</ListItemIcon>
						<ListItemText>Sign Out</ListItemText>
					</MenuItem>
				) : (
					<MenuItem onClick={handleSignIn} disabled={isLoading}>
						<ListItemIcon>
							<LogIn size={18} />
						</ListItemIcon>
						<ListItemText>Sign In</ListItemText>
					</MenuItem>
				)}
			</Menu>
		</>
	);
}
