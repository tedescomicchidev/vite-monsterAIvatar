# Copilot Instructions: Avatar Outfit Configurator

## Project Overview

This is a vanilla JavaScript avatar outfit configurator for Azure Static Web Apps. Users select clothing items from dropdowns to customize an avatar with layered images.

**Key architecture:**
- Vite bundler (using `rolldown-vite@7.2.5` override) → builds to `dist/`
- Vanilla JS modules in `src/` (no framework)
- Static JSON in `public/data/` defines outfit options
- Avatar layer images in `public/assets/`
- Bootstrap for UI components + custom CSS for specific styling

## Development Workflow

**Running the app:**
```bash
npm run dev      # Dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

**Project structure:**
- `src/` - JS modules and styles
- `public/` - Static assets served as-is (images, JSON data)
- `index.html` - Entry point (Vite injects script tags)

## Coding Conventions

**Module patterns:**
- Use ES modules (`import`/`export`) everywhere
- Keep functions small and readable; avoid clever abstractions
- Example from [src/counter.js](src/counter.js): simple event handler pattern with closure for state

**Data flow:**
1. Fetch JSON from `public/data/` at runtime: `fetch('/data/outfits.json')`
2. Validate JSON structure with simple checks (throw on missing required fields)
3. Centralize UI state in a plain object (e.g., `{ selectedShirt: 'red', selectedShoes: 'sneakers' }`)
4. Update DOM from state in dedicated render functions
5. Separate concerns: data loading → state updates → rendering → event wiring

**Styling approach:**
- Bootstrap utility classes first (grid, spacing, buttons)
- Custom CSS in [src/style.css](src/style.css) only when Bootstrap insufficient
- Use CSS custom properties (`:root` variables) for theme values
- Support light/dark mode via `@media (prefers-color-scheme)`

**HTML/Accessibility:**
- Semantic HTML tags (`<select>`, `<button>`, not `<div onclick>`)
- Always include `<label>` for form controls
- Provide `alt` text for avatar images
- Ensure keyboard navigation works (native controls help)

## Data & JSON Schema

**Expected JSON structure for outfit data:**
```json
{
  "shirts": [
    { "id": "shirt-1", "name": "Red Tee", "image": "/assets/shirts/red.png" }
  ],
  "shorts": [...],
  "shoes": [...]
}
```

**Validation rules:**
- Check for required fields (`id`, `name`, `image`) on load
- Show user-friendly error message if JSON fails: "Unable to load outfit options. Please refresh."
- Do NOT hardcode options in JavaScript; always read from JSON

## Azure Static Web Apps

**Deployment assumptions:**
- Build artifact: `dist/` (Vite output)
- Single-page app (no routing by default)
- All computation client-side; no backend/API
- If SPA routing added later: create `staticwebapp.config.json` with navigation fallback rule

## When Responding to Requests

**Default behaviors:**
- Ask where new files should go if ambiguous (`src/` vs `public/`)
- Provide minimal diffs when editing existing code
- Explain assumptions (e.g., "assuming outfits.json uses this schema")
- Don't add dependencies unless explicitly requested
- Use console logs for debugging (can wrap in `if (DEBUG)` flag)

**Testing:**
- If tests requested, suggest Vitest (lightweight, Vite-native)
- Don't add testing libs unprompted

**Never include:**
- Secrets, API keys, or credentials in code/config
- Heavy frameworks/libraries without user approval
