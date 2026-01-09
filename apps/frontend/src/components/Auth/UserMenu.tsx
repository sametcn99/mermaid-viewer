"use client";

import type React from "react";
import { useState, useCallback } from "react";
import {
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Avatar,
	IconButton,
	Tooltip,
	Typography,
	Box,
	CircularProgress,
} from "@mui/material";
import {
	User,
	LogOut,
	Settings,
	RefreshCw,
	Database,
	HardDrive,
	LogIn,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	logout,
	selectUser,
	selectAuthLoading,
	selectIsLocalOnly,
} from "@/store/authSlice";

interface UserMenuProps {
	onOpenSettings?: () => void;
	onSignIn?: () => void;
}

export default function UserMenu({ onOpenSettings, onSignIn }: UserMenuProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isLocalOnly = useAppSelector(selectIsLocalOnly);
	const isLoading = useAppSelector(selectAuthLoading);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [isSyncing, setIsSyncing] = useState(false);
	const open = Boolean(anchorEl);

	const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, []);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, []);

	const handleLogout = useCallback(async () => {
		handleClose();
		await dispatch(logout());
	}, [dispatch, handleClose]);

	const handleSettings = useCallback(() => {
		handleClose();
		onOpenSettings?.();
	}, [handleClose, onOpenSettings]);

	const handleSignIn = useCallback(() => {
		handleClose();
		onSignIn?.();
	}, [handleClose, onSignIn]);

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
