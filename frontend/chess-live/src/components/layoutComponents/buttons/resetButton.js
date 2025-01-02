import React from "react";
import Button from "@mui/material/Button";
import { useChess } from "../../../chessGame/chessGame";
import { showSnackbar } from "../../alerts/customSnackbar";
import { useGlobalVariables } from "../../../globalVariables/globalVariables";

export default function ResetButton() {
    const { resetGame } = useChess();
    const { setSelectedGameId } = useGlobalVariables();

    const handleReset = () => {
        resetGame();
        setSelectedGameId('');
        showSnackbar("Board is ready!", "info");
    };

    return (
        <Button
            variant="contained"
            onClick={handleReset}
            color="error"
        >
            Reset Game
        </Button>
    );
}