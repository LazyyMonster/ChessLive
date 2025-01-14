import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useChess } from "../../../chessGame/chessGame";
import { showSnackbar } from "../../alerts/customSnackbar";
import { useGlobalVariables } from "../../../globalVariables/globalVariables";
import { useTheme } from "@mui/material/styles";

export default function ResetButton() {
  const { resetGame } = useChess();
  const { setSelectedGameId } = useGlobalVariables();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmReset = () => {
    resetGame();
    setSelectedGameId("");
    showSnackbar("Board is ready!", "info");
    setOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          width: "100%",
          marginBottom: "16px",
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
          },
        }}
      >
        Reset Game
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title" style={{ color: theme.palette.primary.main }}>
          Confirm Reset
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description" style={{ color: theme.palette.secondary.dark }}>
            Are you sure you want to reset the game? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: theme.palette.primary.main }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReset}
            sx={{
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
            autoFocus
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}