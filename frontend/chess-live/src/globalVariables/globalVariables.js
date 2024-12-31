import React, { createContext, useState, useContext, useMemo } from 'react';


const GlobalVariablesContext = createContext();

export const GlobalVariablesProvider = ({ children }) => {
    const [isCapturing, setIsCapturing] = useState(false);

    const value = useMemo(() => ({
        isCapturing,
        setIsCapturing,
    }), [isCapturing]);

    return (
        <GlobalVariablesContext.Provider value={value}>
            {children}
        </GlobalVariablesContext.Provider>
    );
};

export const useGlobalVariables = () => useContext(GlobalVariablesContext);