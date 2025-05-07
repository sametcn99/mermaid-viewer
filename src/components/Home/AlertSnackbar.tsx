import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
  open,
  message,
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity="success">
      {message}
    </Alert>
  </Snackbar>
);

export default AlertSnackbar;
