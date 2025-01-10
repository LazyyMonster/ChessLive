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
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsCapturing(false);
    };

    const detectPosition = () => {
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
        setIsCapturing(true);

        intervalRef.current = setInterval(() => {
            const image = capture();
            if (image) {
                setCapturedImage(image);
            }
        }, detectFrequency);
    };

    useEffect(() => {
        if (result !== "ongoing") {
            stopDetection();
        }
    }, [result]);

    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, []);

    // useEffect(() => {
    //     return () => {
    //         if (capturedImage) {
    //             console.log("revoking url object");
    //             URL.revokeObjectURL(capturedImage);
    //         }
    //     };
    // }, [capturedImage]);

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
