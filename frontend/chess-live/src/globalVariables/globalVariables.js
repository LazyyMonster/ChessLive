import React, { createContext, useState, useContext, useMemo } from 'react';


const GlobalVariablesContext = createContext();

export const GlobalVariablesProvider = ({ children }) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState('');

    const value = useMemo(() => ({
        isCapturing,
        setIsCapturing,
        selectedGameId,
        setSelectedGameId,
    }), [isCapturing, selectedGameId]);

    return (
        <GlobalVariablesContext.Provider value={value}>
            {children}
        </GlobalVariablesContext.Provider>
    );
};

export const useGlobalVariables = () => useContext(GlobalVariablesContext);