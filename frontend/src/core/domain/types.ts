// These types mirror the backend API responses

export interface Route {
  id: string;
  routeId: string;
  shipId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComparisonData {
  baseline: Route;
  comparisons: (Route & {
    percentDiff: number;
    compliant: boolean;
  })[];
  target: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface PoolMember {
  shipId: string;
  cb_before: number;
  cb_after: number;
}