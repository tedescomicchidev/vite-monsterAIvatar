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
