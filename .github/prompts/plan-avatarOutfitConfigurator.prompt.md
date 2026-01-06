# Plan: Avatar Outfit Configurator with Bootstrap

Build a minimal-JS avatar configurator with Bootstrap layout: avatar display on left, clothing dropdowns on right. Uses layered PNG images and JSON-driven outfit options.

## Steps

1. **Add Bootstrap** — Install via npm (`bootstrap@5.3` and its peer dependencies) and import CSS in [src/main.js](src/main.js#L1)

2. **Create asset structure** — Set up `public/assets/` with subfolders (`base/`, `shirts/`, `shorts/`, `shoes/`) containing transparent PNG images for layering; create `public/data/outfits.json` defining outfit options with schema `{ id, name, image }`

3. **Update HTML layout** — Replace [index.html](index.html) content with Bootstrap two-column grid: left column for stacksed avatar `<img>` layers, right column for `<select>` dropdowns with `<label>` elements

4. **Implement outfit logic** — Modify [src/main.js](src/main.js) to fetch JSON, populate dropdowns, and update avatar layer `src` attributes on selection change; remove demo code from [src/counter.js](src/counter.js) or repurpose module

5. **Style avatar display** — Add CSS in [src/style.css](src/style.css) for avatar container positioning (relative/absolute for layer stacking) and responsive sizing

## Further Considerations

1. **Asset sourcing** — Do you have soccer player PNG assets already, or should placeholders be created? Layers need transparent backgrounds.

2. **Outfit categories** — You mentioned shoes and t-shirt; what other categories do you want? (shorts, socks, accessories, etc.)

3. **Default outfit** — Should the avatar load with a default outfit selected, or show base character only until user makes selections?
