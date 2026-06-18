import React, { createContext, useState } from 'react';

export const ClinicalContext = createContext();

export const ClinicalProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <ClinicalContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </ClinicalContext.Provider>
  );
};