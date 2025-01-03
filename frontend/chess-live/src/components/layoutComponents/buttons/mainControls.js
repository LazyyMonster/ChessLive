import React from "react";
import Stack from "@mui/material/Stack";
import { useChess } from "../../../chessGame/chessGame";
import LichessButtons from "./lichessButtons";
import ResetButton from "./resetButton";

export default function MainControls() {
    const { isPlayingOnline } = useChess();

    return (
        <>
            <Stack direction="column" spacing={2} alignItems="center">
                <ResetButton />

                {isPlayingOnline && (
                    <LichessButtons />
                )}
            </Stack>
        </>
    );
}