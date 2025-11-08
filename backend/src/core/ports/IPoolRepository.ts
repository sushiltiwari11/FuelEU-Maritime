import { Pool, PoolMember } from '../domain/types';

export interface IPoolRepository {
  createPoolTransaction(
    pool: Omit<Pool, 'id' | 'createdAt'>, 
    members: Omit<PoolMember, 'id' | 'poolId'>[]
  ): Promise<void>;
}