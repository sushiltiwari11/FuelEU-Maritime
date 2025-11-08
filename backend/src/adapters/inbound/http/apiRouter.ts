import { Router, Request, Response, NextFunction } from 'express';
import { ComplianceService } from '../../../core/application/ComplianceService';
import { PoolingService } from '../../../core/application/PoolingService';
import { RouteService } from '../../../core/application/RouteService';

// Custom error handler middleware
// FIX 1: Added types for req, res, and next
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    // Log the error
    console.error(err);
    // Send a 400 for business logic errors, 500 for others
    const statusCode = err.message.includes('Validation failed') || 
                       err.message.includes('No surplus to bank') ||
                       err.message.includes('Not enough banked surplus') ||
                       err.message.includes('No routes found') ||
                       err.message.includes('Total Compliance Balance is negative')
                       ? 400 : 500;
    res.status(statusCode).json({ error: err.message });
  });
};

export function createApiRouter(
  routeService: RouteService,
  complianceService: ComplianceService,
  poolingService: PoolingService
) {
  const router = Router();

  // === /routes ===
  // FIX 2: Added types for req and res
  router.get('/routes', asyncHandler(async (req: Request, res: Response) => {
    const routes = await routeService.getRoutes();
    res.json(routes);
  }));

  // FIX 3: Added types for res
  router.post('/routes/:id/baseline', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await routeService.setBaseline(req.params.id);
    res.status(204).send(); // No Content
  }));

  // FIX 4: Added types for res
  router.get('/routes/comparison', asyncHandler(async (req: Request<{}, {}, {}, { year: string }>, res: Response) => {
    const year = Number(req.query.year);
    if (isNaN(year)) {
      throw new Error('Invalid or missing "year" query parameter.');
    }
    const data = await routeService.getComparison(year); //
    res.json(data);
  }));

  // === /compliance ===
  // FIX 5: Added types for res
  router.get('/compliance/cb', asyncHandler(async (req: Request<{}, {}, {}, { shipId: string, year: string }>, res: Response) => {
    const { shipId, year } = req.query;
    const cb = await complianceService.getOrComputeCB(shipId, Number(year)); //
    res.json({ shipId, year: Number(year), complianceBalance: cb });
  }));

  // FIX 6: Added types for res
  router.get('/compliance/adjusted-cb', asyncHandler(async (req: Request<{}, {}, {}, { shipId: string, year: string }>, res: Response) => {
    const { shipId, year } = req.query;
    const adjustedCb = await complianceService.getAdjustedCB(shipId, Number(year)); //
    res.json({ shipId, year: Number(year), adjustedComplianceBalance: adjustedCb });
  }));

  // === /banking ===
  // FIX 7: Added types for res
  router.get('/banking/records', asyncHandler(async (req: Request<{}, {}, {}, { shipId: string }>, res: Response) => {
    const { shipId } = req.query;
    const records = await complianceService.getBankRecords(shipId); //
    res.json(records);
  }));

  // FIX 8: Added types for res
  router.post('/banking/bank', asyncHandler(async (req: Request<{}, {}, { shipId: string, year: number }>, res: Response) => {
    const { shipId, year } = req.body;
    await complianceService.bankSurplus(shipId, year); //
    res.status(201).json({ message: 'Surplus banked successfully.' });
  }));

  // FIX 9: Added types for res
  router.post('/banking/apply', asyncHandler(async (req: Request<{}, {}, { shipId: string, deficitYear: number, amount: number }>, res: Response) => {
    const { shipId, deficitYear, amount } = req.body;
    await complianceService.applyBankedSurplus(shipId, deficitYear, amount); //
    res.status(200).json({ message: 'Banked surplus applied successfully.' });
  }));

  // === /pools ===
  // FIX 10: Added types for res
  router.post('/pools', asyncHandler(async (req: Request<{}, {}, { year: number, members: { shipId: string, cb_before: number }[] }>, res: Response) => {
    const { year, members } = req.body;
    const result = await poolingService.createPool(year, members); //
    res.status(201).json(result);
  }));
  
  return router;
}