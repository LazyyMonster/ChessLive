import React, { createContext, useState, useContext, useMemo } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [cornerConf, setCornerConf] = useState(0.5);
    const [piecesConf, setPiecesConf] = useState(0.5);
    const [detectedCorners, setDetectedCorners] = useState(null);
    // const [followMode, setFollowMode] = useState('offline'); //offline 2 players irl, lichess 1 player with lichess opponent

    const resetConfidences = () => {
        setCornerConf(0.5);
        setPiecesConf(0.5);
    };

    const value = useMemo(() => ({
        cornerConf,
        setCornerConf,
        piecesConf,
        setPiecesConf,
        resetConfidences,
        detectedCorners,
        setDetectedCorners,
    }), [cornerConf, piecesConf, detectedCorners]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);