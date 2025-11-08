// This React Context provides the ApiClient to the entire app
import React, { createContext, useContext } from 'react';
import type { IComplianceApiService } from 'core/ports/IComplianceApiService';
import { ApiClient } from 'infrastructure/api/apiClient';
const ApiContext = createContext<IComplianceApiService | null>(null);

// Instantiate the client once
const apiClient = new ApiClient();

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ApiContext.Provider value={apiClient}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): IComplianceApiService => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};