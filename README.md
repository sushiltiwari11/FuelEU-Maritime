# FuelEU Maritime Compliance Platform

This is a full-stack (React/Node.js) application built to track, bank, and pool emissions compliance data based on the FuelEU Maritime Regulation.

This project was built as part of an engineering assessment and demonstrates:
* **Hexagonal Architecture** in both frontend and backend.
* Domain-driven logic for complex compliance rules (Banking, Pooling).
* Full-stack TypeScript.
* Documented collaboration with AI agents.

## 🏛️ Architecture Summary

Both the frontend and backend follow a **Hexagonal (Ports & Adapters)** architecture.



[Image of Hexagonal Architecture backend data flow]


* **Core (Domain & Application):** This is the center of the application. It contains all business logic (`PoolingService`, `ComplianceService`) and domain types (`Route`, `PoolMember`). It has **zero dependencies** on any framework (like Express or React) or infrastructure (like Postgres).
* **Ports (Interfaces):** These are interfaces (`IRouteRepository`, `IComplianceApiService`) defined in the Core that describe *what* the application needs from the outside world.
* **Adapters (Infrastructure):** These are the concrete implementations of the ports.
    * **Inbound:** `apiRouter.ts` (Express) and React Components (UI) handle *driving* the application.
    * **Outbound:** `PostgresRouteRepository.ts` (Postgres) and `apiClient.ts` (Fetch) are *driven by* the application.

This separation of concerns makes the core business logic independently testable and portable.

---

## 🚀 Setup & Run Instructions

### Prerequisites
* Node.js (v18+)
* PostgreSQL

### 1. Backend Setup

```bash
# 1. Navigate to the backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup PostgreSQL
#    - Create a database named: fuel_eu_maritime
#    - Update connection details in: backend/src/infrastructure/db/index.ts

# 4. Run the database migration and seeder
#    (You can use psql, DBeaver, or any DB tool to run the file)
psql -U your_user -d fuel_eu_maritime -f src/infrastructure/db/init.sql

# 5. Run the backend server
npm run dev
# Server will run on http://localhost:3001