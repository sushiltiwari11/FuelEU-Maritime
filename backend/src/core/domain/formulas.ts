export const TARGET_INTENSITY_2025 = 89.3368;

export const ENERGY_CONVERSION_FACTOR = 41000;

export function calculateEnergyInScope(fuelConsumption_t: number): number {
  return fuelConsumption_t * ENERGY_CONVERSION_FACTOR;
}

/**
 * Calculates the Compliance Balance (CB) for a ship's aggregated routes.
 * [cite: 155]
 * @param targetIntensity - The regulatory target intensity.
 * @param actualIntensity - The ship's actual achieved GHG intensity.
 * @param totalEnergyInScope - The ship's total energy consumption in MJ.
 * @returns Compliance Balance (positive = surplus, negative = deficit).
 */
export function calculateComplianceBalance(
  targetIntensity: number,
  actualIntensity: number,
  totalEnergyInScope: number
): number {
  return (targetIntensity - actualIntensity) * totalEnergyInScope;
}