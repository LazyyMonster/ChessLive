import React from "react";
import Stack from "@mui/material/Stack";
import { useChess } from "../../../chessGame/chessGame";
import LichessButtons from "./lichessButtons";
import ResetButton from "./resetButton";

export default function MainControls() {
    const { isPlayingOnline } = useChess();

    return (
        <div
            style={{
                width: "250px",
                marginTop: "25px",
            }}
        >
            <Stack direction="column" alignItems="center">
                <ResetButton />

                {isPlayingOnline && (
                    <LichessButtons />
                )}
            </Stack>
        </div>
    );
}