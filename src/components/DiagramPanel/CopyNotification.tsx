import { Snackbar } from "@mui/material";
import React from "react";

interface CopyNotificationProps {
  open: boolean;
  onClose: () => void;
}

const CopyNotification: React.FC<CopyNotificationProps> = ({
  open,
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    message="URL copied to clipboard!"
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  />
);

export default CopyNotification;
