import { IRouteRepository } from '../ports/IRouteRepository';
import { TARGET_INTENSITY_2025 } from '../domain/formulas';

export class RouteService {
  constructor(private routeRepo: IRouteRepository) {}

  async getRoutes() {
    return this.routeRepo.getAll();
  }

  async setBaseline(id: string) {
    const route = await this.routeRepo.getById(id);
    if (!route) {
      throw new Error('Route not found');
    }
    await this.routeRepo.setBaseline(id, route.year);
  }

  async getComparison(year: number) {
    const { baseline, comparisons } = await this.routeRepo.getComparisonData(year);
    if (!baseline) {
      throw new Error(`No baseline route set for year ${year}`);
    }

    const target = TARGET_INTENSITY_2025;// [cite: 77, 153]

    const results = comparisons.map(route => {
      // percentDiff = ((comparison / baseline) - 1) * 100 [cite: 83]
      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= target;
      return {
        ...route,
        percentDiff,
        compliant,
      };
    });

    return {
      baseline,
      comparisons: results,
      target,
    };
  }
}