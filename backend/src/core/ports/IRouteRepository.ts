import { Route } from '../domain/types';

export interface IRouteRepository {
  getAll(): Promise<Route[]>;
  getById(id: string): Promise<Route | null>;
  setBaseline(id: string, year: number): Promise<void>;
  getComparisonData(year: number): Promise<{ baseline: Route | null; comparisons: Route[] }>;
  getRoutesByShipAndYear(shipId: string, year: number): Promise<Route[]>;
}