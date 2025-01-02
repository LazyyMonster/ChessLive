import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useChess } from "../../../chessGame/chessGame";
import LichessButtons from "./lichessButtons";
import ResetButton from "./resetButton";

export default function MainControls() {
    const { loadPreviewGame } = useChess();
    const { isPlayingOnline } = useChess();

    return (
        <>
            <Stack direction="column" spacing={2} alignItems="center">
                <ResetButton />
                <Button variant="outlined" onClick={loadPreviewGame}>
                    Load Preview Game
                </Button>
            </Stack>

            {isPlayingOnline && (
                <LichessButtons />
            )}
        </>
    );
}