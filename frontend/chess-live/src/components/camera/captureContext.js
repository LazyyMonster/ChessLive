import React, { createContext, useCallback, useRef, useContext } from "react";
import { CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT } from '../settings/constants';

const CaptureContext = createContext();

export function CaptureProvider({ children }) {
    const webcamRef = useRef(null);

    const setWebcamRef = (ref) => {
        webcamRef.current = ref;
    };

    const capture = useCallback(() => {
        if (!webcamRef.current) {
            console.error("Webcam reference is not set. Capture aborted.");
            return null;
        }

        const imageSrc = webcamRef.current.getScreenshot({ 
            width: CAPTURED_IMAGE_WIDTH, 
            height: CAPTURED_IMAGE_HEIGHT 
        });
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
        <CaptureContext.Provider value={{ capture, setWebcamRef, webcamRef }}>
            {children}
        </CaptureContext.Provider>
    );
}

export function useCapture() {
    return useContext(CaptureContext);
}
