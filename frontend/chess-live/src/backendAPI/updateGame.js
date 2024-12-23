import React, { useState, useRef } from "react";
import { useCapture } from "../components/camera/captureContext";
import DetectPieces from "./detectPieces";
import Button from "@mui/material/Button";
import { useSettings } from "../components/settings/settings";

export default function UpdateGame({ setFenDetected }) {
    const { capture } = useCapture();
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const intervalRef = useRef(null);
    const { detectFrequency } = useSettings();

    const detectPosition = () => {
        if (isCapturing) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsCapturing(false);
        } else {
            setIsCapturing(true);
            intervalRef.current = setInterval(() => {
                const image = capture();
                if (image) {
                    setCapturedImage(image);
                }
            }, detectFrequency);
        }
    };

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
