import { IPoolRepository } from '../../../core/ports/IPoolRepository';
import { Pool, PoolMember } from '../../../core/domain/types';
import { pool } from '../../../infrastructure/db';

export class PostgresPoolRepository implements IPoolRepository {
  
  async createPoolTransaction(
    poolData: Omit<Pool, 'id' | 'createdAt'>,
    members: Omit<PoolMember, 'id' | 'poolId'>[]
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const poolRes = await client.query(
        'INSERT INTO pools (year) VALUES ($1) RETURNING id',
        [poolData.year]
      );
      const poolId = poolRes.rows[0].id;

      for (const member of members) {
        await client.query(
          `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
           VALUES ($1, $2, $3, $4)`,
          [poolId, member.shipId, member.cb_before, member.cb_after]
        );
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}