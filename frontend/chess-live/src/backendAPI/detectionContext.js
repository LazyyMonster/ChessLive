import React, { createContext, useContext, useRef, useState, useCallback } from "react";

const DetectionContext = createContext();

export const DetectionProvider = ({ children }) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const intervalRef = useRef(null);

    const stopDetection = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsCapturing(false);
    }, []);

    const startDetection = useCallback((callback, detectFrequency) => {
        if (isCapturing) return;

        setIsCapturing(true);
        intervalRef.current = setInterval(callback, detectFrequency);
    }, [isCapturing]);

    return (
        <DetectionContext.Provider value={{ isCapturing, startDetection, stopDetection }}>
            {children}
        </DetectionContext.Provider>
    );
};

export const useDetection = () => useContext(DetectionContext);
