import { Pool } from 'pg';

// !! REPLACE with your local Postgres credentials !!
export const pool = new Pool({
  user: 'sushiltiwari',       // <--- CHANGE THIS
  host: 'localhost',
  database: 'fuel_eu_maritime',
  password: '123456', // <--- PUT THE PASSWORD YOU JUST SET
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Database connected:', res.rows[0].now);
  }
});