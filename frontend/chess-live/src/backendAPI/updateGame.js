import React, { useState, useRef, useEffect } from "react";
import { useCapture } from "../components/camera/captureContext";
import DetectPieces from "./detectPieces";
import Button from "@mui/material/Button";
import { useSettings } from "../components/settings/settings";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { useGlobalVariables } from "../globalVariables/globalVariables";
import { useChess } from "../chessGame/chessGame";

export default function UpdateGame({ setFenDetected }) {
    const { capture } = useCapture();
    const { isCapturing, setIsCapturing } = useGlobalVariables();
    const { detectFrequency, detectedCorners } = useSettings();
    const [capturedImage, setCapturedImage] = useState(null);
    const intervalRef = useRef(null);
    const { isGameOver, gameOverReason, result } = useChess();

    const detectPosition = () => {
        if (isGameOver()) {
            const reason = gameOverReason();
            showSnackbar(reason, "info");
            setIsCapturing(false);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
        if (!detectedCorners) {
            showSnackbar("You must detect corners first!", "warning");
            return;
        }
        if (isCapturing) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsCapturing(false);
            showSnackbar("Detecting position stopped!", "info");
        } else {
            showSnackbar("Detecting position started!", "success");
            setIsCapturing(true);
            intervalRef.current = setInterval(() => {
                const image = capture();
                if (image) {
                    setCapturedImage(image);
                }
                // Stop detection if the game is over during interval execution
                if (isGameOver()) {
                    const reason = gameOverReason();
                    showSnackbar(reason, "info");
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setIsCapturing(false);
                }
            }, detectFrequency);
        }
    };


    // Cleanup when result changes
    useEffect(() => {
        if (result === "ongoing") {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCapturedImage(null);
            setIsCapturing(false);
            // showSnackbar("result changes in update game!", "info");
        }

    }, [result]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setIsCapturing(false);
        };
    }, []);

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

            {capturedImage && (
                <div>
                    <DetectPieces image={capturedImage} setFenDetected={setFenDetected} />
                </div>
            )}
        </>
    );
}
