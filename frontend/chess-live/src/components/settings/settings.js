import React, { createContext, useState, useContext, useMemo } from 'react';
import { DETECT_FREQUENCY } from './constants';


const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [cornerConf, setCornerConf] = useState(0.5);
    const [piecesConf, setPiecesConf] = useState(0.5);
    const [detectedCorners, setDetectedCorners] = useState(null);
    const [detectFrequency, setDetectFrequency] = useState(DETECT_FREQUENCY);
    // const [followMode, setFollowMode] = useState('offline'); //offline 2 players irl, lichess 1 player with lichess opponent

    const resetConfidences = () => {
        setCornerConf(0.5);
        setPiecesConf(0.5);
    };

    const resetDetectFrequency = () => {
        setDetectFrequency(DETECT_FREQUENCY);
    }

    const value = useMemo(() => ({
        cornerConf,
        setCornerConf,
        piecesConf,
        setPiecesConf,
        resetConfidences,
        detectedCorners,
        setDetectedCorners,
        detectFrequency,
        setDetectFrequency,
        resetDetectFrequency,
    }), [cornerConf, piecesConf, detectedCorners, detectFrequency]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);