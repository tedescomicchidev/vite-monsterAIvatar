# Plan: Avatar Outfit Configurator

A simple web app with a soccer player avatar on the left that updates as users select clothing items (shirt, shorts, shoes) from Bootstrap dropdowns on the right. Uses minimal JavaScript with data-driven options loaded from JSON, layered PNG images for the avatar, and Bootstrap for UI components.

## Steps

1. **Add Bootstrap CDN** to `index.html` (CSS + JS bundle) and create basic two-column layout with `#avatar-display` (left) and `#outfit-controls` (right)

2. **Create asset structure**: `public/data/outfits.json` defining clothing options (ids, labels, image paths) and `public/assets/` folders (shirts/, shorts/, shoes/, base/) with layered PNG images for avatar parts

3. **Build data loader** in `src/lib/dataLoader.js` with `loadOutfitData()` to fetch/validate JSON schema (required: id, label, category, imagePath fields) and fail gracefully

4. **Implement state manager** in `src/lib/state.js` with single state object `{ outfit: { shirt, shorts, shoes } }` and `updateState()` function

5. **Create render function** in `src/lib/renderer.js` that layers avatar images by swapping `<img src>` for each clothing category based on current state

6. **Wire up UI** in `src/main.js`: populate Bootstrap dropdowns from loaded data, bind change events to `updateState()` + `renderAvatar()`, replace Vite demo template

## Further Considerations

1. **Asset creation approach** — Will you create PNG layers yourself, use AI-generated images, or need placeholder SVGs for initial development?

2. **Dropdown population** — Generate three hardcoded dropdowns (shirt/shorts/shoes only) or make it data-driven to support any number of categories from JSON?

3. **Default outfit** — Should avatar load with a preset default look, or show a "base" character with no clothing until selections are made?
