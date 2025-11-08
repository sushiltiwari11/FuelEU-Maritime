# AI Agent Workflow Log

This document logs the usage of AI agents (Google Gemini, GitHub Copilot) to build the FuelEU Maritime platform, as required by the assignment.

## Agents Used

* **Google Gemini:** Used for brainstorming, generating boilerplate for specific files, and debugging complex configuration/type errors.
* **GitHub Copilot:** Used for inline code completion of repetitive tasks (e.g., Tailwind classes, mapping array data).

---

## Prompts & Outputs

### Example 1: Backend Architecture Scaffolding (Gemini)

* **Prompt:** "Based on the hexagonal architecture specified in the PDF, generate the `mkdir` commands to create the directory structure for my Node.js backend."
* **Output:** The AI provided the shell commands to create the `src/core/domain`, `src/core/application`, `src/adapters/inbound`, etc.
* **Refinement:** This was a simple, one-time task that saved me from manually creating the folders, allowing me to start writing the core domain logic immediately.

### Example 2: Generating Adapter Boilerplate (Gemini)

* **Prompt:** "Here is my `IRouteRepository` TypeScript interface. Generate a class `PostgresRouteRepository` that implements this interface, using `node-postgres` for the database connection."
* **Output:** Gemini generated the class file with the correct methods, but all the method bodies were simple stubs (e.g., `pool.query('SELECT * ...')`).
* **Validation:** This was a significant time-saver for a repetitive task. I then went through and manually wrote all the *actual* SQL queries, including the transaction logic for `setBaseline` and the specific joins/filters needed. The AI created the skeleton; I implemented the logic.

### Example 3: Debugging TSConfig & Type Errors (Gemini)

* **Prompt:** "I'm getting `Cannot find name 'jest'` in my `.test.ts` files, even though I've installed `@types/jest`. Here is my `tsconfig.json`."
* **Output:** The AI's first suggestion (adding `"types": ["jest"]`) didn't work.
* **Correction:** After I told it the fix failed, it analyzed the `tsconfig.json` again and correctly identified the real problem: I had `"**/*.test.ts"` in my `exclude` array, which was causing TypeScript to ignore the test files. Removing this fixed the issue.
* **Observation:** This was a high-value use. The AI acted as a "smarter Stack Overflow" to solve an obscure configuration issue, not a core logic problem.

### Example 4: Frontend UI Boilerplate (Copilot)

* **Prompt (as an inline code comment):** `// Create a TailwindCSS table row for a 'route' object`
* **Output (Copilot suggestion):** Copilot suggested the `<tr>` and `<td>` elements with the correct `className` attributes and `route.routeId`, `route.vesselType`, etc.
* **Validation:** This was highly efficient for the repetitive task of building the UI. I accepted the suggestion and then manually added the unique logic, like the conditional rendering for the "Baseline" badge and the `onClick` handler for the "Set as Baseline" button.

---

## Observations

### Where AI Saved Time

* **Repetitive Boilerplate:** Generating the initial class files for adapters, the basic `apiClient.ts` structure, and the method stubs for repositories.
* **Frontend UI (TailwindCSS):** Using Copilot to write Tailwind classes was a massive speed boost. I could describe what I wanted in a comment, and it would generate the complex `className` strings.
* **Configuration Debugging:** The AI was invaluable for solving obscure `tsconfig.json` and `vite.config.ts` issues, which are time-consuming but not related to business logic.

### Where AI Failed or Hallucinated

* **Core Business Logic:** The AI was **completely unable** to generate the core business logic for the `PoolingService`. Its attempt at the "greedy allocation" algorithm was simplistic, incorrect, and unusable. I had to write this complex logic 100% manually to meet the spec's rules.
* **Incorrect Debugging:** The AI's first attempt to fix the `jest` type issue was wrong. It required me to guide it to the correct answer.
* **Type Mismatches:** The AI frequently confused `string` and `number` types (e.g., `ghgIntensity`). It generated code like `val.toFixed(2)` on strings, which I had to manually debug and fix with `Number(val)`.

### How I Combined Tools

I used **Gemini** as an "architect's assistant" to scaffold files and help debug specific, non-domain problems. I used **GitHub Copilot** as my "autocomplete," handling repetitive in-file tasks like completing CSS classes and `map` functions. This left me free to focus my time on what mattered: designing the architecture, writing the core domain logic, and ensuring the final product was correct.