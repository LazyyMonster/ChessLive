import React, { createContext, useRef, useContext } from "react";
import { CAPTURED_IMAGE_WIDTH, CAPTURED_IMAGE_HEIGHT } from '../settings/constants';
import { showSnackbar } from "../alerts/customSnackbar";

const CaptureContext = createContext();

export function CaptureProvider({ children }) {
    const webcamRef = useRef(null);

    const setWebcamRef = (ref) => {
        webcamRef.current = ref;
    };

    const capture = () => {
        if (!webcamRef.current) {
            showSnackbar("Webcam reference is not set. Capture aborted.", "error");
            return null;
        }

        const imageSrc = webcamRef.current.getScreenshot({
            width: CAPTURED_IMAGE_WIDTH,
            height: CAPTURED_IMAGE_HEIGHT
        });

        return imageSrc;
    };

    // useEffect(() => {
    //     console.log("cleaning");
    //     return () => {
    //         if (webcamRef.current && webcamRef.current.srcObject) {
    //             const tracks = webcamRef.current.srcObject.getTracks();
    //             tracks.forEach((track) => track.stop());
    //         }
    //     };
    // }, []);

    return (
        <CaptureContext.Provider value={{ capture, setWebcamRef, webcamRef }}>
            {children}
        </CaptureContext.Provider>
    );
}

export function useCapture() {
    return useContext(CaptureContext);
}
