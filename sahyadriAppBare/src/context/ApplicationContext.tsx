import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ApplicationData {
  personalDetails: any;
  bankDetails: any;
  location: any;
  selfieBase64: string | null;
}

interface ApplicationContextType {
  data: ApplicationData;
  updatePersonalDetails: (details: any) => void;
  updateBankDetails: (details: any) => void;
  updateLocation: (location: any) => void;
  updateSelfie: (base64: string) => void;
  clearData: () => void;
}

const defaultState: ApplicationData = {
  personalDetails: {},
  bankDetails: {},
  location: null,
  selfieBase64: null,
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(defaultState);

  const updatePersonalDetails = (details: any) => {
    setData((prev) => ({ ...prev, personalDetails: { ...prev.personalDetails, ...details } }));
  };

  const updateBankDetails = (details: any) => {
    setData((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, ...details } }));
  };

  const updateLocation = (location: any) => {
    setData((prev) => ({ ...prev, location }));
  };

  const updateSelfie = (base64: string) => {
    setData((prev) => ({ ...prev, selfieBase64: base64 }));
  };

  const clearData = () => {
    setData(defaultState);
  };

  return (
    <ApplicationContext.Provider value={{ data, updatePersonalDetails, updateBankDetails, updateLocation, updateSelfie, clearData }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationData = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationData must be used within an ApplicationProvider');
  }
  return context;
};
