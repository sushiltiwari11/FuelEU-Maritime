import { calculateComplianceBalance, calculateEnergyInScope, TARGET_INTENSITY_2025 } from '../domain/formulas';
import { IComplianceRepository } from '../ports/IComplianceRepository';
import { IRouteRepository } from '../ports/IRouteRepository';

export class ComplianceService {
  constructor(
    private complianceRepo: IComplianceRepository,
    private routeRepo: IRouteRepository
  ) {}

  /**
   * Computes and stores the CB for a ship in a given year.
   [cite_start]* [cite: 166]
   */
  async getOrComputeCB(shipId: string, year: number): Promise<number> {
    const routes = await this.routeRepo.getRoutesByShipAndYear(shipId, year);
    if (routes.length === 0) {
      throw new Error(`No routes found for ship ${shipId} in ${year}`);
    }

    // This is a simplification. Real aggregation would be a weighted average.
    const totalEnergy = routes.reduce((sum, r) => sum + calculateEnergyInScope(r.fuelConsumption), 0);
    const avgIntensity = routes.reduce((sum, r) => sum + r.ghgIntensity, 0) / routes.length;

    const cb = calculateComplianceBalance(
      TARGET_INTENSITY_2025, // Note: Target may vary by year
      avgIntensity,
      totalEnergy
    );

    await this.complianceRepo.saveOrUpdateComplianceSnapshot({
      shipId,
      year,
      cb_gco2eq: cb,
    });

    return cb;
  }

  /**
   * Gets the final CB *after* any banked funds have been applied.
   [cite_start]* [cite: 168]
   */
  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    const originalCB = await this.getOrComputeCB(shipId, year);
    
    // Find all funds *applied* to this year's deficit
    const appliedEntries = await this.complianceRepo.getAppliedBankEntries(shipId, year);
    const totalApplied = appliedEntries.reduce((sum, entry) => sum + entry.amount_gco2eq, 0);

    return originalCB + totalApplied;
  }

  /**
   * Gets all available (un-used) banked surplus for a ship.
   [cite_start]* [cite: 170]
   */
  async getBankRecords(shipId: string) {
    return this.complianceRepo.getBankedSurplus(shipId);
  }

  /**
   * Banks a positive compliance balance from a given year.
   [cite_start]* [cite: 171]
   */
  async bankSurplus(shipId: string, year: number): Promise<void> {
    const cb = await this.getOrComputeCB(shipId, year);

    if (cb <= 0) {
      throw new Error('No surplus to bank. Compliance Balance is not positive.');
    }

    await this.complianceRepo.saveBankEntry({
      shipId,
      year, // The year the surplus was generated
      amount_gco2eq: cb,
    });
  }

  /**
   * Applies a specific amount of banked surplus to a deficit year.
   [cite_start]* [cite: 172]
   */
  async applyBankedSurplus(shipId: string, deficitYear: number, amountToApply: number): Promise<void> {
    if (amountToApply <= 0) {
      throw new Error('Amount to apply must be positive.');
    }

    const deficit = await this.getOrComputeCB(shipId, deficitYear);
    if (deficit >= 0) {
      throw new Error('Cannot apply surplus to a non-deficit year.');
    }

    const availableEntries = await this.complianceRepo.getBankedSurplus(shipId);
    const totalAvailable = availableEntries.reduce((sum, e) => sum + e.amount_gco2eq, 0);

    if (amountToApply > totalAvailable) {
      throw new Error(`Not enough banked surplus. Available: ${totalAvailable}, Tried to apply: ${amountToApply}`);
    }

    // Deduct from available bank entries (FIFO logic)
    let amountRemainingToDeduct = amountToApply;
    for (const entry of availableEntries) {
      if (amountRemainingToDeduct <= 0) break;

      const amountToDeductFromThisEntry = Math.min(entry.amount_gco2eq, amountRemainingToDeduct);
      await this.complianceRepo.updateBankEntry(entry.id, entry.amount_gco2eq - amountToDeductFromThisEntry);
      
      amountRemainingToDeduct -= amountToDeductFromThisEntry;
    }

    // Save a record of this application
    await this.complianceRepo.saveAppliedBankEntry({
      shipId,
      year: deficitYear, // The year the deficit is IN
      amount_gco2eq: amountToApply,
    });
  }
}