import { Menu, MenuItem } from "@mui/material";
import type React from "react";

interface AppBarMenuProps {
	anchorEl: null | HTMLElement;
	onClose: () => void;
	onManageSavedDiagrams: () => void;
}

const AppBarMenu: React.FC<AppBarMenuProps> = ({
	anchorEl,
	onClose,
	onManageSavedDiagrams,
}) => (
	<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
		<MenuItem
			onClick={() => {
				onClose();
				onManageSavedDiagrams();
			}}
		>
			Manage Saved Diagrams
		</MenuItem>
	</Menu>
);

export default AppBarMenu;
