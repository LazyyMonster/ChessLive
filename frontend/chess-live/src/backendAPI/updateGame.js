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

    const stopDetection = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsCapturing(false);
    };

    const detectPosition = () => {
        if (!detectedCorners) {
            showSnackbar("You must detect corners first!", "warning");
            return;
        }

        if (isCapturing) {
            stopDetection();
            showSnackbar("Detecting position stopped!", "info");
        } else {
            if (result !== "ongoing") {
                showSnackbar("The game is already over! Cannot start detection.", "warning");
                return;
            }

            showSnackbar("Detecting position started!", "success");
            setIsCapturing(true);
            intervalRef.current = setInterval(() => {
                // Check if the game is over or the result has changed
                if (isGameOver() || result !== "ongoing") {
                    const reason = isGameOver() ? gameOverReason() : "Game result is set!";
                    showSnackbar(reason, "info");
                    stopDetection();
                    return;
                }

                // Capture and process the image
                const image = capture();
                if (image) {
                    setCapturedImage(image);
                }
            }, detectFrequency);
        }
    };

    // Cleanup when the result changes
    useEffect(() => {
        if (result !== "ongoing") {
            stopDetection();
        }
    }, [result]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopDetection();
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
