import React, { useState, useRef } from "react";
import { useCapture } from "../components/camera/captureContext";
import DetectPieces from "./detectPieces";

export default function UpdateGame() {
    const { capture } = useCapture();
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const intervalRef = useRef(null);

    const handleCapture = () => {
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
    };

    return (
        <div>
            <button onClick={handleCapture}>
                {isCapturing ? "Stop Detection" : "Start Detection"}
            </button>
            {capturedImage && <DetectPieces image={capturedImage} />}
        </div>
    );
}
