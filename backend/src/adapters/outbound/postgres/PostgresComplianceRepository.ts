import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { ShipCompliance, BankEntry } from '../../../core/domain/types';
import { pool } from '../../../infrastructure/db';
import { toCamelCase } from '../../../shared/mappers';

export class PostgresComplianceRepository implements IComplianceRepository {
  
  async getComplianceSnapshot(shipId: string, year: number): Promise<ShipCompliance | null> {
    const res = await pool.query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    if (res.rows.length === 0) return null;
    return toCamelCase(res.rows[0]);
  }

  async saveOrUpdateComplianceSnapshot(compliance: Omit<ShipCompliance, 'id'>): Promise<ShipCompliance> {
    const { shipId, year, cb_gco2eq } = compliance;
    const res = await pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
       VALUES ($1, $2, $3)
       ON CONFLICT (ship_id, year)
       DO UPDATE SET cb_gco2eq = $3
       RETURNING *`,
      [shipId, year, cb_gco2eq]
    );
    return toCamelCase(res.rows[0]);
  }

  async getBankedSurplus(shipId: string, year?: number): Promise<BankEntry[]> {
    let query = 'SELECT * FROM bank_entries WHERE ship_id = $1 AND amount_gco2eq > 0 ORDER BY year ASC'; // FIFO
    let params = [shipId];

    if (year) {
      query = 'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 AND amount_gco2eq > 0 ORDER BY year ASC';
      params.push(year.toString());
    }

    const res = await pool.query(query, params);
    return toCamelCase(res.rows);
  }

  async saveBankEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry> {
    const { shipId, year, amount_gco2eq } = entry;
    const res = await pool.query(
      'INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *',
      [shipId, year, amount_gco2eq]
    );
    return toCamelCase(res.rows[0]);
  }

  async updateBankEntry(id: string, newAmount: number): Promise<void> {
    await pool.query('UPDATE bank_entries SET amount_gco2eq = $1 WHERE id = $2', [newAmount, id]);
  }

  async getAppliedBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    const res = await pool.query(
      'SELECT * FROM bank_entries_applied WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return toCamelCase(res.rows);
  }

  async saveAppliedBankEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry> {
    const { shipId, year, amount_gco2eq } = entry;
    const res = await pool.query(
      'INSERT INTO bank_entries_applied (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *',
      [shipId, year, amount_gco2eq]
    );
    return toCamelCase(res.rows[0]);
  }
}