Create a GitHub Copilot custom instructions file for this repository.

Output: a single Markdown file at `.github/copilot-instructions.md`.

Project context:

* Goal: a simple “avatar outfit configurator” web app.
* Hosting: Azure Static Web Apps (static hosting only; no backend).
* Frontend tooling: Vite build (output `dist/`), vanilla JavaScript (no framework), Bootstrap for layout/components, plus custom CSS.
* Data: static JSON files stored under `public/data/` (e.g., `public/data/outfits.json`) that define dropdown options (shirts, shorts, shoes, etc.). The app loads JSON via `fetch('/data/...')`.
* Assets: avatar layers are images under `public/assets/` (e.g., shirts/shoes layers). The UI updates the avatar by swapping image sources or toggling CSS classes.

What the instructions file must contain:

1. Coding style & conventions

* Prefer small, readable functions; avoid “clever” code.
* Use modern ES modules (`import/export`) in `src/`.
* Keep logic in `src/` and static files in `public/`.
* Use Bootstrap utility classes first; only add custom CSS when needed.
* Use semantic HTML and accessibility basics (labels for selects, alt text, keyboard-friendly controls).

2. Architecture rules

* Single-page app (one page). No router unless requested.
* Treat JSON as source of truth for dropdowns; do not hardcode options in JS.
* Centralize state in a plain JS object; update UI from state in a predictable way.
* Provide a clear separation between:

  * data loading (fetch + validation),
  * state updates,
  * rendering (DOM updates),
  * event wiring.

3. Data and validation

* Define expected JSON schema (high level) and validate required fields at runtime with simple checks (no heavy libs).
* Fail gracefully: show a user-friendly message if JSON fails to load.

4. Testing & quality

* If tests are requested, default to lightweight tests (e.g., Vitest) but do not add dependencies unless asked.
* Prefer console-friendly debug logs behind a `DEBUG` flag.

5. Azure Static Web Apps guidance

* Assume deploy config uses Vite build to `dist/`.
* If SPA routing is ever added, mention `staticwebapp.config.json` and navigation fallback.
* Keep everything static and client-side.

6. Output format

* Write the instructions as clear bullet points and short sections with headings.
* Include “When responding to requests…” guidance for Copilot: e.g., always ask where files should go, default to providing diffs/snippets, keep changes minimal, and explain assumptions.

Do NOT include any secrets, tokens, or environment-specific credentials.
