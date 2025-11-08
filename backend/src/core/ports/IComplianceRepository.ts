import { ShipCompliance, BankEntry } from '../domain/types';

export interface IComplianceRepository {
  getComplianceSnapshot(shipId: string, year: number): Promise<ShipCompliance | null>;
  saveOrUpdateComplianceSnapshot(compliance: Omit<ShipCompliance, 'id'>): Promise<ShipCompliance>;
  
  getBankedSurplus(shipId: string, year?: number): Promise<BankEntry[]>;
  saveBankEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry>;
  updateBankEntry(id: string, newAmount: number): Promise<void>;
  
  // Gets all *applications* of banked funds for a year
  getAppliedBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  saveAppliedBankEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry>;
}