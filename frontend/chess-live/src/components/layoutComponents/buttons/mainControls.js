import React from "react";
import Button from "@mui/material/Button";
import { useChess } from "../../../chessGame/chessGame";
import LichessButtons from "./lichessButtons";
import ResetButton from "./resetButton";

export default function MainControls() {
    const { loadPreviewGame } = useChess();
    const { isPlayingOnline } = useChess();

    return (
        <>
            <div>
                <ResetButton />
                <Button variant="outlined" onClick={loadPreviewGame}>
                    Load Preview Game
                </Button>
            </div>

            {isPlayingOnline && (
                <LichessButtons />
            )}
        </>
    );
}