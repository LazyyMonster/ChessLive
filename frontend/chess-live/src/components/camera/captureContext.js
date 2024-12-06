import React, { createContext, useRef, useCallback, useContext } from "react";
import Webcam from "react-webcam";

const CaptureContext = createContext();

export function CaptureProvider({ children }) {

    let webcamRef = null;

    const setWebcamRef = (ref) => {
        webcamRef = ref;
    };

    const capture = useCallback(() => {

        if (!webcamRef || !webcamRef.current) {
            console.error("Webcam reference is not set. Capture aborted.");
            return null;
        }

        const imageSrc = webcamRef.current.getScreenshot({ width: 3840, height: 2160 });
        if (imageSrc) {
            const imgElement = new Image();
            imgElement.onload = () => {
                console.log(`Captured image size: ${imgElement.width}x${imgElement.height}`);
            };
            imgElement.src = imageSrc;
        }

        return imageSrc;
    }, [webcamRef]);

    return (
        <CaptureContext.Provider value={{ capture, setWebcamRef }}>
            {children}
        </CaptureContext.Provider>
    );
}

export function useCapture() {
    return useContext(CaptureContext);
}