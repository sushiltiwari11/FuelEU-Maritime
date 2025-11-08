import { IPoolRepository } from '../ports/IPoolRepository';

type PoolMemberInput = { shipId: string; cb_before: number };
type PoolMemberInternal = { shipId: string; cb_before: number; cb_after: number };

export class PoolingService {
  constructor(private poolRepo: IPoolRepository) {}

  /**
   * Creates a pool and allocates CB according to rules.
   [cite_start]* [cite: 175-183]
   */
  async createPool(year: number, members: PoolMemberInput[]): Promise<PoolMemberInternal[]> {
    const totalPoolCB = members.reduce((sum, m) => sum + m.cb_before, 0);

    // Rule: Sum(adjustedCB) >= 0 [cite: 176]
    if (totalPoolCB < 0) {
      throw new Error('Pool creation failed: Total Compliance Balance is negative.');
    }

   // Perform greedy allocation [cite: 180-182]
    const finalMembers = this.allocateSurplus(members);

    // Validate post-allocation rules [cite: 177-179]
    for (const member of finalMembers) {
      if (member.cb_before < 0 && member.cb_after < member.cb_before) {
     // [cite: 178]
        throw new Error(`Validation failed: Deficit ship ${member.shipId} exited worse off.`);
      }
      if (member.cb_before > 0 && member.cb_after < 0) {
        // [cite: 179]
        throw new Error(`Validation failed: Surplus ship ${member.shipId} exited with a deficit.`);
      }
    }

    // Save to repository
    await this.poolRepo.createPoolTransaction({ year }, finalMembers);

    return finalMembers;
  }

  /**
   * Greedy allocation logic.
   [cite_start]* [cite: 180-182]
   */
  private allocateSurplus(members: PoolMemberInput[]): PoolMemberInternal[] {
    const deficits = members
      .filter(m => m.cb_before < 0)
      .map(m => ({ ...m, cb_after: m.cb_before }))
      .sort((a, b) => a.cb_before - b.cb_before); // Sort ascending (most negative first)

    const surpluses = members
      .filter(m => m.cb_before >= 0)
      .map(m => ({ ...m, cb_after: m.cb_before }))
      .sort((a, b) => b.cb_before - a.cb_before); // Sort descending (largest surplus first)

    let surplusIndex = 0;

    // Iterate through each deficit ship
    for (const deficitShip of deficits) {
      let deficitAmount = -deficitShip.cb_after; // Amount needed to get to 0

      // Draw from surplus ships until deficit is covered or surplus runs out
      while (deficitAmount > 0 && surplusIndex < surpluses.length) {
        const surplusShip = surpluses[surplusIndex];
        const surplusAvailable = surplusShip.cb_after; // Surplus this ship has *left*

        if (surplusAvailable <= 0) {
          surplusIndex++; // This ship has no surplus left, move to next
          continue;
        }
        
        const transferAmount = Math.min(deficitAmount, surplusAvailable);
        
        deficitShip.cb_after += transferAmount;
        surplusShip.cb_after -= transferAmount;
        deficitAmount -= transferAmount;
      }
    }

    return [...deficits, ...surpluses];
  }
}