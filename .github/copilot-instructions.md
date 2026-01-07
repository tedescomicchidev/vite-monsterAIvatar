# Copilot Instructions

## Project Snapshot
- Single-page Vite app targeting an "avatar outfit configurator"; everything ships as static assets for Azure Static Web Apps (see README).
- Current starter UI under [src/main.js](../src/main.js) is temporary; keep new logic modular so it can replace the scaffold incrementally.
- No backend. All persistence is client-side and based on static JSON plus image layers under `public/`.

## Architecture & State
- Treat dropdown/selector options as data-driven. Load JSON from `public/data/*.json`, validate required fields (ids, labels, asset paths) before use, and never hardcode options in code.
- Keep app state in a single plain object (e.g., `const state = { outfit: {...} }`). Update state first, then trigger render helpers so DOM changes stay predictable.
- Split responsibilities: `loadData()` (fetch + shape), `updateState(partial)`, `renderAvatar(state)`, `bindEvents()`; avoid mixing fetch logic with DOM manipulation.
- Use ES module structure already in `src/` (Vite expects `import`/`export`). Derive new utilities under `src/lib/` or `src/features/` instead of polluting `main.js`.

## Data & Assets
- JSON lives under `public/data/` (e.g., `outfits.json`). Define and document schemas inside the code (required keys, allowed values) and fail gracefully when validation fails.
- Avatar layers sit under `public/assets/` (shirts, shorts, shoes, etc.). Render by swapping image `src` values or toggling CSS classes for each layer.
- When fetch fails or schema mismatches, show a friendly message in the UI rather than throwing; log detailed info only when a `DEBUG` flag/environment is set.

## Styling & UI
- Bootstrap provides layout/components. Reach for utility classes first; only add custom selectors in [src/style.css](../src/style.css) when Bootstrap cannot cover the need.
- Maintain semantic HTML: label every control, supply `alt` text for avatar layers, keep controls keyboard navigable.
- Use lightweight, readable CSS; prefer data attributes over deeply nested selectors for avatar layers.

## Build & Deployment Workflow
- Scripts (`npm run dev|build|preview`) come from [package.json](../package.json); builds produce `dist/` for Azure Static Web Apps.
- If client-side routing is ever introduced, add `staticwebapp.config.json` with SPA fallback instructions, but until then keep plain file serving.
- Stay dependency-light: vanilla JS + Bootstrap + Vite; add libraries only with explicit justification.

## Responding to Requests
- Clarify the desired file locations and expected behavior before coding; confirm when new folders/modules are introduced.
- Default to proposing minimal diffs or focused snippets; explain assumptions, especially around JSON shape or asset naming.
- Highlight any required manual steps (e.g., updating `public/data/*.json`, adding new images) when relevant.
- Suggest console logging guarded by a `DEBUG` constant when deeper insight is needed; disable by default to keep console clean.
- Keep explanations short but specific so maintainers understand why a change matters.
