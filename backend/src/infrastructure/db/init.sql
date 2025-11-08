-- Drop tables if they exist
DROP TABLE IF EXISTS pool_members;
DROP TABLE IF EXISTS pools;
DROP TABLE IF EXISTS bank_entries_applied;
DROP TABLE IF EXISTS bank_entries;
DROP TABLE IF EXISTS ship_compliance;
DROP TABLE IF EXISTS routes;

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(10) NOT NULL,
  ship_id VARCHAR(10) NOT NULL, -- Added this field
  vessel_type VARCHAR(50),
  fuel_type VARCHAR(50),
  year INT NOT NULL,
  ghg_intensity NUMERIC(10, 5),
  fuel_consumption NUMERIC(10, 2),
  distance NUMERIC(10, 2),
  total_emissions NUMERIC(10, 2),
  is_baseline BOOLEAN DEFAULT false
);

CREATE TABLE ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  cb_gco2eq NUMERIC(15, 2),
  UNIQUE(ship_id, year)
);

CREATE TABLE bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(10) NOT NULL,
  year INT NOT NULL, -- Year surplus was *generated*
  amount_gco2eq NUMERIC(15, 2)
);

-- Separate table to track *applications* of banked funds
CREATE TABLE bank_entries_applied (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(10) NOT NULL,
  year INT NOT NULL, -- Year deficit *occurred*
  amount_gco2eq NUMERIC(15, 2)
);

CREATE TABLE pools (
  id SERIAL PRIMARY KEY,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pool_members (
  id SERIAL PRIMARY KEY,
  pool_id INT REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(10) NOT NULL,
  cb_before NUMERIC(15, 2),
  cb_after NUMERIC(15, 2)
);

INSERT INTO routes
  (route_id, ship_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions)
VALUES
  ('R001', 'SHIP01', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500),
  ('R002', 'SHIP01', 'BulkCarrier', 'LNG', 2024, 88.0, 4800, 11500, 4200),
  ('R003', 'SHIP02', 'Tanker', 'MGO', 2024, 93.5, 5100, 12500, 4700),
  ('R004', 'SHIP02', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300),
  ('R005', 'SHIP01', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400);

UPDATE routes SET is_baseline = true WHERE route_id = 'R001';