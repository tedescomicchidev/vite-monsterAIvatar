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
