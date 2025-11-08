import request from 'supertest';
// Mock dependencies *before* importing the app
const mockCreatePool = jest.fn();
jest.mock('../../../core/application/PoolingService', () => {
  return {
    PoolingService: jest.fn().mockImplementation(() => {
      return { createPool: mockCreatePool };
    }),
  };
});
jest.mock('../../../core/application/ComplianceService');
jest.mock('../../../core/application/RouteService');

// Now import the app (which will use the mocks)
import { app } from '../../../infrastructure/server/server'; 

describe('API Endpoints', () => {

  beforeEach(() => {
    // Reset mocks before each test
    mockCreatePool.mockReset();
  });

  describe('POST /api/pools', () => {
    it('should fail with 400 if the service throws a business logic error', async () => {
      const invalidPool = {
        year: 2025,
        members: [{ shipId: 'A', cb_before: -100 }],
      };
      
      // Configure the mock to throw the specific error
      mockCreatePool.mockRejectedValue(new Error('Pool creation failed: Total Compliance Balance is negative.'));

      const res = await request(app).post('/api/pools').send(invalidPool);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain('Total Compliance Balance is negative');
    });

    it('should succeed with 201 on a valid pool', async () => {
      const validPool = {
        year: 2025,
        members: [
          { shipId: 'A', cb_before: 100 },
          { shipId: 'B', cb_before: -50 },
        ],
      };
      const mockResult = [{ shipId: 'A', cb_after: 50 }, { shipId: 'B', cb_after: 0 }];
      
      // Configure the mock to return a successful result
      mockCreatePool.mockResolvedValue(mockResult);

      const res = await request(app).post('/api/pools').send(validPool);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(mockResult);
    });
  });

  // You would add more tests here for other endpoints
});