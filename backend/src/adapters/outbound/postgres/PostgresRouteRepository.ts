import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Route } from '../../../core/domain/types';
import { pool } from '../../../infrastructure/db';
import { toCamelCase } from '../../../shared/mappers';

export class PostgresRouteRepository implements IRouteRepository {
  async getAll(): Promise<Route[]> {
    const res = await pool.query('SELECT * FROM routes');
    return toCamelCase(res.rows);
  }

  async getById(id: string): Promise<Route | null> {
    const res = await pool.query('SELECT * FROM routes WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return toCamelCase(res.rows[0]);
  }

  async setBaseline(id: string, year: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Only set other routes from the *same year* to false
      await client.query('UPDATE routes SET is_baseline = false WHERE year = $1', [year]);
      await client.query('UPDATE routes SET is_baseline = true WHERE id = $1', [id]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getRoutesByShipAndYear(shipId: string, year: number): Promise<Route[]> {
    const res = await pool.query(
      'SELECT * FROM routes WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return toCamelCase(res.rows);
  }

  async getComparisonData(year: number): Promise<{ baseline: Route | null; comparisons: Route[] }> {
    const baselineRes = await pool.query(
      'SELECT * FROM routes WHERE is_baseline = true AND year = $1',
      [year]
    );
    const comparisonsRes = await pool.query(
      'SELECT * FROM routes WHERE is_baseline = false AND year = $1',
      [year]
    );
    
    return {
      baseline: baselineRes.rows.length > 0 ? toCamelCase(baselineRes.rows[0]) : null,
      comparisons: toCamelCase(comparisonsRes.rows),
    };
  }
}