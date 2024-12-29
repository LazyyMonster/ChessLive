import React, { useState, useRef, useEffect } from "react";
import { useCapture } from "../components/camera/captureContext";
import DetectPieces from "./detectPieces";
import Button from "@mui/material/Button";
import { useSettings } from "../components/settings/settings";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { useGlobalVariables } from "../globalVariables/globalVariables";

export default function UpdateGame({ setFenDetected }) {
    const { capture } = useCapture();
    const { isCapturing, setIsCapturing } = useGlobalVariables();
    const { detectFrequency, detectedCorners } = useSettings();
    const [capturedImage, setCapturedImage] = useState(null);
    const intervalRef = useRef(null);

    const detectPosition = () => {
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
            }, detectFrequency);
        }
    };

    useEffect(() => {
        // stop detection when not in play pages
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
