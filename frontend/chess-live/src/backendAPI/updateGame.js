import React, { useState, useRef } from "react";
import { useCapture } from "../components/camera/captureContext";
import DetectPieces from "./detectPieces";
import Button from "@mui/material/Button";


export default function UpdateGame() {
    const { capture } = useCapture();
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const intervalRef = useRef(null);
    const [isValidStart, setIsValidStart] = useState(true);


    const detectPosition = () => {
        if (!isValidStart) {
            console.log("not valid starting position")
        }
        else {
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
                }, 3000);
            }
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
                    <DetectPieces image={capturedImage} />
                </div>
            )}
        </>
    );
}
