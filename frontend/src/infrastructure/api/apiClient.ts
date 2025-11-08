// This is our "Adapter"
import type { IComplianceApiService } from 'core/ports/IComplianceApiService';
import type { Route, ComparisonData, BankEntry, PoolMember } from 'core/domain/types';

const API_URL = 'http://localhost:3001/api';

/**
 * A wrapper for fetch to handle common tasks and error handling
 */
async function fetchWrapper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json() as T;
}

export class ApiClient implements IComplianceApiService {

  getRoutes(): Promise<Route[]> {
    return fetchWrapper<Route[]>('/routes');
  }

  setBaseline(id: string): Promise<void> {
    return fetchWrapper<void>(`/routes/${id}/baseline`, { method: 'POST' });
  }

  getComparison(year: number): Promise<ComparisonData> {
    return fetchWrapper<ComparisonData>(`/routes/comparison?year=${year}`);
  }

  getCB(shipId: string, year: number): Promise<{ shipId: string, year: number, complianceBalance: number }> {
    return fetchWrapper(`/compliance/cb?shipId=${shipId}&year=${year}`);
  }

  getAdjustedCB(shipId: string, year: number): Promise<{ shipId: string, year: number, adjustedComplianceBalance: number }> {
    return fetchWrapper(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
  }

  getBankRecords(shipId: string): Promise<BankEntry[]> {
    return fetchWrapper<BankEntry[]>(`/banking/records?shipId=${shipId}`);
  }

  bankSurplus(shipId: string, year: number): Promise<void> {
    return fetchWrapper<void>('/banking/bank', {
      method: 'POST',
      body: JSON.stringify({ shipId, year }),
    });
  }

  applySurplus(shipId: string, deficitYear: number, amount: number): Promise<void> {
    return fetchWrapper<void>('/banking/apply', {
      method: 'POST',
      body: JSON.stringify({ shipId, deficitYear, amount }),
    });
  }

  createPool(year: number, members: { shipId: string; cb_before: number }[]): Promise<PoolMember[]> {
    return fetchWrapper<PoolMember[]>('/pools', {
      method: 'POST',
      body: JSON.stringify({ year, members }),
    });
  }
}