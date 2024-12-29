import React, { createContext, useState, useContext, useMemo } from 'react';
import { CORNERS_CONFIDENCE, DETECT_FREQUENCY, PIECES_CONFIDENCE } from './constants';


const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [cornersConf, setCornersConf] = useState(CORNERS_CONFIDENCE);
    const [piecesConf, setPiecesConf] = useState(PIECES_CONFIDENCE);
    const [detectedCorners, setDetectedCorners] = useState(null);
    const [detectFrequency, setDetectFrequency] = useState(DETECT_FREQUENCY);

    const resetConfidences = () => {
        setCornersConf(CORNERS_CONFIDENCE);
        setPiecesConf(PIECES_CONFIDENCE);
    };

    const resetDetectFrequency = () => {
        setDetectFrequency(DETECT_FREQUENCY);
    }

    const value = useMemo(() => ({
        cornersConf,
        setCornersConf,
        piecesConf,
        setPiecesConf,
        resetConfidences,
        detectedCorners,
        setDetectedCorners,
        detectFrequency,
        setDetectFrequency,
        resetDetectFrequency,
    }), [cornersConf, piecesConf, detectedCorners, detectFrequency]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);