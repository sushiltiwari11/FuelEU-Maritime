// From [cite: 112-117, 147]
export interface Route {
  id: string;
  routeId: string;
  shipId: string; // Assumed from API spec
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number; // in tonnes (t)
  distance: number; // in km
  totalEmissions: number; // in tonnes (t)
  isBaseline: boolean;
}

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cb_gco2eq: number; // Compliance Balance in gCO2eq
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number; // Year the surplus was banked
  amount_gco2eq: number; // Amount remaining in this entry
}

export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  id: string;
  poolId: string;
  shipId: string;
  cb_before: number;
  cb_after: number;
}