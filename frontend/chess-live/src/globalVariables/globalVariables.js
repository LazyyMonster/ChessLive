import React, { createContext, useState, useContext, useMemo } from 'react';


const GlobalVariablesContext = createContext();

export const GlobalVariablesProvider = ({ children }) => {
    const [selectedGameId, setSelectedGameId] = useState('');
    const [detectedCorners, setDetectedCorners] = useState(null);

    const value = useMemo(() => ({

        selectedGameId,
        setSelectedGameId,
        detectedCorners,
        setDetectedCorners,
    }), [ selectedGameId, detectedCorners]);

    return (
        <GlobalVariablesContext.Provider value={value}>
            {children}
        </GlobalVariablesContext.Provider>
    );
};

export const useGlobalVariables = () => useContext(GlobalVariablesContext);