// This is our "Port"
// It defines the contract for our API client

import type { Route, ComparisonData, BankEntry, PoolMember } from '../domain/types';

export interface IComplianceApiService {
  getRoutes(): Promise<Route[]>;
  setBaseline(id: string): Promise<void>;
  getComparison(year: number): Promise<ComparisonData>;
  
  getCB(shipId: string, year: number): Promise<{ shipId: string, year: number, complianceBalance: number }>;
  getAdjustedCB(shipId: string, year: number): Promise<{ shipId: string, year: number, adjustedComplianceBalance: number }>;
  
  getBankRecords(shipId: string): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number): Promise<void>;
  applySurplus(shipId: string, deficitYear: number, amount: number): Promise<void>;
  
  createPool(year: number, members: { shipId: string, cb_before: number }[]): Promise<PoolMember[]>;
}