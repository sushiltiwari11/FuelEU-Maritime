# Reflection on AI-Agent Collaboration

This one-page essay reflects on the process of building the FuelEU platform, focusing on the use of AI agents as required by the assignment.

## What I Learned Using AI Agents

The most significant lesson was learning the **difference between an AI "Coder" and an AI "Architect."** Initially, I tried to have the AI (Gemini) write entire features from scratch. This often failed because the AI didn't understand the full architectural context, such as the Hexagonal pattern.

I learned to be more effective by changing my approach. I would:
1.  **Act as the architect** and write the "skeleton" files and interfaces (the Ports).
2.  **Use the AI as the coder** to fill in the "how" (the Adapters).

For example, I defined `IRouteRepository.ts` myself. Then, I prompted the AI: "Implement this `IRouteRepository` interface using `node-postgres` in a class called `PostgresRouteRepository`." This was far more successful.

I also learned that AI is a powerful **debugger for "unknown unknowns."** When I had TypeScript errors, I knew what to search for. But when my `jest` tests wouldn't run, I had no idea it was a `tsconfig.json` issue. The AI diagnosed this configuration problem instantly.

## Efficiency Gains vs. Manual Coding

The efficiency gains were undeniable, but they were not linear.
* **Frontend (5x-10x speed):** Generating React components, TailwindCSS, and the API client was incredibly fast. A task like building the `apiClient.ts` (with all 10 endpoints, request/response types, and error handling) would have taken an hour manually. The AI did it in 30 seconds.
* **Backend Boilerplate (3x speed):** Writing the Express router and Postgres repository implementations was significantly faster.
* **Core Business Logic (1x speed):** The AI provided *no speed benefit* for writing the core `PoolingService` logic. The "greedy allocation" algorithm was complex and specific. The AI's placeholder was incorrect, and I had to write it manually. In this case, debugging the AI's "help" would have been *slower* than just writing it myself from the start.

Overall, I estimate this 72-hour assignment was completed in about 30-35 hours. **I attribute at least a 50% reduction in time** directly to the AI agents.

## Improvements for Next Time

1.  **AI-Driven Testing:** I spent time manually writing unit tests for the pooling service logic. Next time, I would write the function signature and a detailed comment describing its behavior and edge cases, and then ask the AI to generate the complete test file (`.test.ts`). This seems like a perfect task for AI.
2.  **Custom Instructions:** I would start the project by feeding the AI my `tsconfig.json`, my directory structure, and my core architectural rules (e.g., "Always import using base URL `src/`", "The core MUST NOT import from `adapters`"). This would prevent the AI from making mistakes like the `../..` imports, saving debugging time.
3.  **Use AI for Documentation:** I wrote this `README.md` manually. I could have prompted the AI: "Scan my `/backend` directory and generate the Setup & Run instructions for my `README.md`," which would have been faster.