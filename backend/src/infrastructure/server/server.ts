import express from 'express';
import cors from 'cors'; // Import cors
import { createApiRouter } from '../../adapters/inbound/http/apiRouter';

// 1. Import concrete repositories
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/PostgresPoolRepository';

// 2. Import application services
import { RouteService } from '../../core/application/RouteService';
import { ComplianceService } from '../../core/application/ComplianceService';
import { PoolingService } from '../../core/application/PoolingService';

// 3. Instantiate adapters
const routeRepo = new PostgresRouteRepository();
const complianceRepo = new PostgresComplianceRepository();
const poolRepo = new PostgresPoolRepository();

// 4. Instantiate and inject services
const routeService = new RouteService(routeRepo);
const complianceService = new ComplianceService(complianceRepo, routeRepo);
const poolingService = new PoolingService(poolRepo);

// 5. Create Express app
const app = express();
app.use(cors()); // Enable CORS for your frontend
app.use(express.json());

// 6. Pass services to the router
app.use('/api', createApiRouter(routeService, complianceService, poolingService));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export { app }; // Export for testing