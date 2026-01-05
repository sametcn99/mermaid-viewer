"use client";

import React, { useState, useCallback } from "react";
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
import { User, LogOut, Settings, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, selectUser, selectAuthLoading } from "@/store/authSlice";

interface UserMenuProps {
	onOpenSettings?: () => void;
	onSyncData?: () => Promise<void>;
}

export default function UserMenu({
	onOpenSettings,
	onSyncData,
}: UserMenuProps) {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
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

	const handleSync = useCallback(async () => {
		if (isSyncing || !onSyncData) return;

		setIsSyncing(true);
		try {
			await onSyncData();
		} finally {
			setIsSyncing(false);
		}
	}, [isSyncing, onSyncData]);

	if (!user) return null;

	const displayName = user.displayName || user.email.split("@")[0];
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<>
			<Tooltip title="Account">
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
							bgcolor: "primary.main",
						}}
					>
						{initials}
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
						{user.email}
					</Typography>
				</Box>

				<Divider />

				{onSyncData && (
					<MenuItem onClick={handleSync} disabled={isSyncing}>
						<ListItemIcon>
							{isSyncing ? (
								<CircularProgress size={18} />
							) : (
								<RefreshCw size={18} />
							)}
						</ListItemIcon>
						<ListItemText>Sync Data</ListItemText>
					</MenuItem>
				)}

				{onOpenSettings && (
					<MenuItem onClick={handleSettings}>
						<ListItemIcon>
							<Settings size={18} />
						</ListItemIcon>
						<ListItemText>Account Settings</ListItemText>
					</MenuItem>
				)}

				<Divider />

				<MenuItem onClick={handleLogout} disabled={isLoading}>
					<ListItemIcon>
						<LogOut size={18} />
					</ListItemIcon>
					<ListItemText>Sign Out</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}
