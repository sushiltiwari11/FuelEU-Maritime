import { PoolingService } from './PoolingService';
import { IPoolRepository } from '../ports/IPoolRepository';

// 1. Create a "mock" repository
const mockPoolRepo: jest.Mocked<IPoolRepository> = {
  createPoolTransaction: jest.fn(),
};

// 2. Clear mocks before each test
beforeEach(() => {
  mockPoolRepo.createPoolTransaction.mockClear();
});

describe('PoolingService', () => {
  
  const poolingService = new PoolingService(mockPoolRepo);

  it('should throw an error if the total pool CB is negative', async () => {
    const members = [
      { shipId: 'A', cb_before: -100 },
      { shipId: 'B', cb_before: -50 },
    ];
    await expect(poolingService.createPool(2025, members))
      .rejects
      .toThrow('Total Compliance Balance is negative');
    expect(mockPoolRepo.createPoolTransaction).not.toHaveBeenCalled();
  });

  it('should correctly allocate surplus to one deficit ship', async () => {
    const members = [
      { shipId: 'Surplus', cb_before: 100 },
      { shipId: 'Deficit', cb_before: -50 },
    ];
    
    const result = await poolingService.createPool(2025, members);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ shipId: 'Deficit', cb_before: -50, cb_after: 0 }),
        expect.objectContaining({ shipId: 'Surplus', cb_before: 100, cb_after: 50 }),
      ])
    );
    expect(mockPoolRepo.createPoolTransaction).toHaveBeenCalled();
  });

  it('should correctly allocate surplus from multiple ships to multiple deficits', async () => {
    const members = [
      { shipId: 'S1', cb_before: 100 },
      { shipId: 'D1', cb_before: -50 },
      { shipId: 'S2', cb_before: 20 },
      { shipId: 'D2', cb_before: -80 }, // Total deficit: -130, Total surplus: 120
    ];
    
    const result = await poolingService.createPool(2025, members);
    
    expect(result).toEqual(
      expect.arrayContaining([
        // D2 is most negative, gets S1's 100 -> D2 is now at 20
        // D1 is next, gets S2's 20 -> D1 is now at -30
        expect.objectContaining({ shipId: 'D2', cb_before: -80, cb_after: 20 }), // S1's 100 used
        expect.objectContaining({ shipId: 'D1', cb_before: -50, cb_after: -30 }), // S2's 20 used
        expect.objectContaining({ shipId: 'S1', cb_before: 100, cb_after: 0 }),
        expect.objectContaining({ shipId: 'S2', cb_before: 20, cb_after: 0 }),
      ])
    );
  });
  
  it('should throw error if surplus ship exits negative', async () => {
    // This is a sanity check, the logic shouldn't allow it, but we test the rule
    const poolingServiceWithBadLogic = new PoolingService(mockPoolRepo);
    // @ts-ignore
    poolingServiceWithBadLogic.allocateSurplus = () => [
      { shipId: 'S1', cb_before: 100, cb_after: -10 }, // Violates rule
      { shipId: 'D1', cb_before: -50, cb_after: -50 },
    ];
    
    await expect(poolingServiceWithBadLogic.createPool(2025, []))
      .rejects
      .toThrow('Surplus ship S1 exited with a deficit');
  });
});