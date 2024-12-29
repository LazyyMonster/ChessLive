import React, { createContext, useState, useContext, useMemo } from 'react';


const GlobalVariablesContext = createContext();

export const GlobalVariablesProvider = ({ children }) => {
    const [followMode, setFollowMode] = useState('offline'); // 'offline' 2 players irl, 'lichess' 1 player with lichess opponent
    const [isCapturing, setIsCapturing] = useState(false);

    const value = useMemo(() => ({
        followMode,
        setFollowMode,
        isCapturing,
        setIsCapturing,
    }), [followMode, isCapturing]);

    return (
        <GlobalVariablesContext.Provider value={value}>
            {children}
        </GlobalVariablesContext.Provider>
    );
};

export const useGlobalVariables = () => useContext(GlobalVariablesContext);