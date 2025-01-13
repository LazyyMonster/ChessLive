import React, { useEffect, useCallback } from "react";
import { useCapture } from "../components/camera/captureContext";
import Button from "@mui/material/Button";
import { useSettings } from "../components/settings/settings";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { useGlobalVariables } from "../globalVariables/globalVariables";
import { useChess } from "../chessGame/chessGame";
import { fenRequest } from "./apiUtils";
import { useDetection } from "./detectionContext";
import { useLichess } from "../lichessAPI/lichessGame";

export default function UpdateGame() {
    const { isCapturing, startDetection, stopDetection } = useDetection();
    const { capture } = useCapture();
    const { detectFrequency, piecesConf } = useSettings();
    const { detectedCorners } = useGlobalVariables();
    const {
        makeMove,
        returnAndMakeMove,
        findMove,
        isPlayingOnline,
        getHistory,
        result,
        setFenDetected,
        fenDetected
    } = useChess();
    const { sendMove, playerColor } = useLichess();

    const detectPosition = useCallback(() => {
        if (isCapturing) {
            stopDetection();
            showSnackbar("Detecting position stopped!", "info");
            return;
        }

        if (result !== "ongoing") {
            showSnackbar("The game is already over! Cannot start detection.", "warning");
            return;
        }

        if (!detectedCorners) {
            showSnackbar("You must detect corners first!", "warning");
            return;
        }

        showSnackbar("Detecting position started!", "success");

        startDetection(() => {
            const image = capture();
            if (!detectedCorners) {
                showSnackbar("Before starting following, you must detect 4 corners.", "error");
                return;
            }

            if (!image) {
                showSnackbar("No image available for detection.", "error");
                return;
            }

            fenRequest(image, detectedCorners, piecesConf, setFenDetected);
        }, detectFrequency);
    }, [isCapturing, stopDetection, result, detectedCorners, piecesConf, detectFrequency, capture, setFenDetected, startDetection]);

    const handleMove = useCallback(() => {
        if (result !== "ongoing") return;

        if (!isPlayingOnline) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) makeMove(detectedMove);
            return;
        }

        const moves = getHistory();
        const isPlayerTurn =
            (playerColor === "white" && moves.length % 2 === 0) ||
            (playerColor === "black" && moves.length % 2 !== 0);

        if (isPlayerTurn) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                const playerMove = returnAndMakeMove(detectedMove);
                sendMove(playerMove);
            }
        }
    }, [result, isPlayingOnline, fenDetected, playerColor, getHistory, findMove, makeMove, sendMove, returnAndMakeMove]);


    useEffect(() => {
        if (result !== "ongoing") {
            stopDetection();
        }
    }, [result, stopDetection]);

    useEffect(() => {
        if (isCapturing) {
            handleMove();
        }
    }, [fenDetected, handleMove, isCapturing]);


    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);

    return (
        <>
            <Button
                onClick={detectPosition}
                sx={{
                    backgroundColor: isCapturing ? "#ff4d4f" : "#4caf50",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: isCapturing ? "#ff7875" : "#66bb6a",
                    },
                }}
            >
                {isCapturing ? "Stop Following" : "Start Following"}
            </Button>
        </>
    );
}
