<<<<<<< HEAD
## Avatar Outfit Configurator

A vanilla JavaScript experience that lets supporters recolor a layered soccer avatar. The build targets Azure Static Web Apps, relies on Bootstrap for layout, and keeps all data/images in `public/` so the app remains static-only.

### Features

- Bootstrap split layout with the avatar on the left and outfit controls on the right.
- Layered PNG stack for hair, shirt, pants, shoes, plus an optional captain band.
- JSON-driven dropdowns so kit options can be updated without touching JavaScript.
- Live status text describing the current selection to improve accessibility.

### Getting Started

```bash
npm install
npm run dev     # local dev server with HMR
npm run build   # production build to dist/
npm run preview # preview the production bundle
npm run test    # Vitest unit tests
```

### Outfit Data

Options live in `public/data/outfits.json` and follow this shape:

```json
{
  "hair": [{ "id": "hair-id", "name": "Display Name", "image": "/assets/hair/hair-id.png" }],
  "shirts": [{ "id": "shirt-id", "name": "Kit", "image": "/assets/shirts/shirt-id.png" }],
  "pants": [{ "id": "pants-id", "name": "Shorts", "image": "/assets/pants/pants-id.png" }],
  "shoes": [{ "id": "shoes-id", "name": "Cleats", "image": "/assets/shoes/shoes-id.png" }],
  "captainBand": { "id": "captain-band", "name": "Captain Band", "image": "/assets/extras/captain-band.png" },
  "defaults": {
    "hair": "hair-id",
    "shirts": "shirt-id",
    "pants": "pants-id",
    "shoes": "shoes-id",
    "captainBand": false
  }
}
```

Every option must declare `id`, `name`, and `image`. To add more looks, drop PNG layers into `public/assets/<category>/` and reference them from the JSON. Placeholder art can be regenerated with `python3 scripts/generate_assets.py`.

### Architecture Notes

- `src/main.js` handles fetching JSON, managing state, rendering images, and wiring events.
- `src/outfitData.js` validates the JSON payload so the UI can show a friendly error if anything is missing.
- The UI updates DOM only through state changes—dropdown events mutate a single `state` object and trigger rerenders.

### Testing

Vitest covers the data-normalization helpers. Run `npm run test` to make sure schema changes or new categories keep passing validation.

### Accessibility & Responsiveness

- Every control has a `<label>` and is reachable via keyboard.
- Live region text mirrors the current kit for screen reader users.
- The layout collapses to a stacked column on mobile while keeping avatar proportions intact.

### Deployment

- Build with `npm run build`; Azure Static Web Apps should deploy the `dist/` folder.
- No routing is required today. If a SPA router is introduced later, add a `staticwebapp.config.json` navigation fallback.
=======
# Monster AIvatar Locker

A lightweight avatar outfit configurator built with Vite, vanilla JavaScript, Bootstrap, and layered PNG assets. The experience is designed for Azure Static Web Apps deployments, so everything runs on the client.

## Getting Started

1. Install dependencies
  ```bash
  npm install
  ```
2. Start the dev server (includes HMR)
  ```bash
  npm run dev
  ```
3. Build for production (outputs to `dist/`)
  ```bash
  npm run build
  ```
4. Preview the production bundle locally
  ```bash
  npm run preview
  ```

## Outfit Data

Outfit options live in `public/data/outfits.json` and follow this schema:

```json
{
  "shirts": [{ "id": "shirt-crimson", "name": "Crimson Jersey", "image": "/assets/shirts/crimson-jersey.png" }],
  "shorts": [{ "id": "shorts-midnight", "name": "Midnight Shorts", "image": "/assets/shorts/midnight-shorts.png" }],
  "shoes": [{ "id": "shoes-neo", "name": "Neo Boots", "image": "/assets/shoes/neo-boots.png" }]
}
```

The app fetches the JSON at runtime, validates that every category exists, and ensures each item includes `id`, `name`, and `image`. Update or extend the catalog by editing the JSON file—no JavaScript changes required.

## Assets

Layered PNGs live under `public/assets/`:

- `base/` — the neutral character silhouette
- `shirts/` — tops rendered on the torso
- `shorts/` — lower-body garments
- `shoes/` — cleats and footwear

Every image maintains the same canvas size so layers stack cleanly. When adding new art, keep transparency intact and export with the existing dimensions (currently 320×480).

## UI Architecture

- Layout: Bootstrap grid with a left-hand preview pane and right-hand control stack
- Styles: Custom theme tokens and gradients in `src/style.css`; Bootstrap utilities for spacing and typography
- Logic: `src/main.js` orchestrates fetch → validation → state updates → DOM rendering
- Accessibility: Semantic labels for selects, alt text on every layer, and live region for status updates

## Deployment Notes

- `npm run build` creates the `dist/` folder expected by Azure Static Web Apps
- The app is a single static page; no routing is configured. Add `staticwebapp.config.json` with a navigation fallback if client routing is introduced later
- All data loads via relative `/data/...` paths that work in dev and production

## Customization Tips

- Tweak typography and gradients in `src/style.css` to re-skin the experience
- Add new outfit categories by mirroring the existing structure (update HTML selects, JSON schema, and rendering logic)
- Consider a `DEBUG` flag in `src/main.js` if you need temporary logging in production builds
>>>>>>> origin/dev
