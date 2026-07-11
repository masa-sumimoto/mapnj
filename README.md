# MapNJ

![MapNJ Screenshot](https://mapnj.masa-sumimoto.com/public/readme-hero.png)

![npm version](https://img.shields.io/npm/v/mapnj.svg?color=red)
![NPM Downloads](https://img.shields.io/npm/dt/mapnj.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18.svg)

[Official Web Site](https://mapnj.masa-sumimoto.com/)

A script to add interactivity to SVG-based illustration maps

- Manipulates SVG illustrations
- Manages the selection and deselection states of SVG illustration parts
- Separates design and code roles in production
- Customizes SVG illustration fill and line colors based on context
- Allows for the addition of related parts involved in operations

Check out the [demo](https://mapnj.masa-sumimoto.com/demo-nexus-of-r/) to see it in action.

# Super simple demo

Paste the following into an html file and check it in your browser.
Your SVG elements will manage the state.

```html
<div id="your-mapnj">
  <svg
    width="600"
    height="400"
    viewBox="0 0 600 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle id="mapnj-area-blue" cx="204" cy="200" r="40" fill="blue" />
    <circle id="mapnj-area-yellow" cx="300" cy="200" r="40" fill="yellow" />
    <circle id="mapnj-area-red" cx="396" cy="200" r="40" fill="red" />
  </svg>
</div>
<script src="https://cdn.jsdelivr.net/npm/mapnj@latest/dist/MapNJ.min.js"></script>
<script>
  const mapnj = new MapNJ('#your-mapnj');
</script>
```

# Usage

## Installation

### Using NPM

To use MapNJ with NPM, run the following command:

```
$ npm install mapnj
```

### Using CDN

You can also include MapNJ directly in your HTML file using a CDN. Add the following script tag to your HTML:

```
<script src="https://cdn.jsdelivr.net/npm/mapnj@latest/dist/MapNJ.min.js"></script>
```

### Direct Script Usage

For the latest releases, please visit the [GitHub Releases page](https://github.com/masa-sumimoto/mapnj/releases).

## Design Source Setup

MapNJ requires both JavaScript and SVG (design source) preparation. We recommend using Adobe Illustrator or Figma for creating design sources, as they can output layer names as id attributes or data-name attributes.
For more details, please refer to the [Design Source Setup](https://mapnj.masa-sumimoto.com/usage/#design-source-setup) section on the official website.

## Code Preparation

```html
<div id="your-mapnj">
  <svg>
    <defs>
      <style></style>
    </defs>

    <!-- mapping to basic nodes -->
    <path id="mapnj-area-xxx" d="" />
    <path id="mapnj-label-xxx" d="" />

    <!-- mapping to group nodes -->
    <g id="mapnj-area-xxx"><path d="" /><path d="" /></g>
    <g id="mapnj-label-xxx"><path d="" /><path d="" /></g>
  <svg>
</div>
```

```JavaScript
// via Node Module

import MapNJ from 'mapnj';

const mapnj = new MapNJ('#your-mapnj');
```

## React

MapNJ ships a React adapter as a subpath export (`mapnj/react`, React >= 18):

```tsx
import { useMapNJ } from 'mapnj/react';

function TouristMap() {
  const { ref, state, selectArea, reset } = useMapNJ({
    areaActiveFillColor: '#e8b4a0',
  });

  return (
    <div>
      <div ref={ref}>{/* inline SVG with mapnj-area-* ids */}</div>
      <p>Active area: {state.activeAreaId || 'none'}</p>
      <button onClick={() => selectArea('red')}>Select red</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

The hook creates the instance when `ref` is attached, keeps `state` in sync with selection / hover, and destroys the instance on unmount (StrictMode-safe).

## Programmatic API (vanilla)

```js
const mapnj = new MapNJ('#your-mapnj');

mapnj.selectArea('red'); // select from your own code
mapnj.reset();           // deselect
mapnj.activeAreaId;      // current selection (also: hoverAreaId, prevActiveAreaId)
mapnj.getState();        // snapshot of the whole state

const off = mapnj.subscribe((state) => console.log(state)); // any state change
off();
```

## API Documentation

For detailed API documentation, please visit the [Advanced Usage](https://mapnj.masa-sumimoto.com/advanced-usage/) section on the official website.

## License

This project is licensed under the MIT License. See the LICENSE file in the project root for full license information.

# Changelog

## [1.0.0-alpha.2] - 2026-07-11

v1 modernization (Phase 2): headless store + React adapter.

### Added

- **React adapter** (`mapnj/react`): `useMapNJ()` hook — creates the instance via callback ref, syncs selection/hover into React state, destroys on unmount (StrictMode-safe). React >= 18 as an optional peer dependency.
- **Public state API** on the core: `selectArea(id)`, `reset()`, `getState()`, `subscribe(listener)` (returns unsubscribe), and `activeAreaId` / `hoverAreaId` / `prevActiveAreaId` getters. Programmatic selection notifies observers the same way external selector clicks do.
- **Headless store** (`src/core/store.ts`): state and subscriptions now live in a DOM-free store, paving the way for other framework adapters.

## [1.0.0-alpha.1] - 2026-07-11

v1 modernization (Phase 1). The library core has been brought up to 2026 standards.

### Changed

- **ESM-first packaging.** The package now ships ESM (`dist/index.js`), CJS (`dist/index.cjs`), and IIFE (`dist/MapNJ.min.js`) via an `exports` map. The CDN path `dist/MapNJ.min.js` is unchanged, so existing embeds keep working. The old `lib/` output is gone — import paths other than the package root are no longer supported.
- **Hover now uses Pointer Events** (`pointerenter` / `pointerleave`). Touch input no longer triggers hover, which fixes the "sticky hover" problem on touch devices.
- **Typed events.** `on()` only accepts valid action names (TypeScript) and now returns an unsubscribe function: `const off = mapnj.on('AREA_CLICK', cb); off();`
- Build tooling: webpack + tsc → tsup. Tests: Jest → Vitest.

### Added

- **Keyboard accessibility.** Areas and clickable labels get `role="button"`, `tabindex="0"`, and respond to Enter / Space. The active area exposes `aria-pressed="true"`.
- **CSS styling hooks.** The container now carries `data-mapnj-active-area` / `data-mapnj-hover-area`, and each area/label carries `data-mapnj-state="active|default"` — style states from your own CSS with attribute selectors, e.g. `[data-mapnj-active-area="tokyo"] .legend { ... }`.
- **`prefers-reduced-motion` support.** Transitions and label entrance animations are skipped when the OS reduced-motion setting is on.

### Fixed

- `labelActiveFillColors` (per-label active fill) was reading from `labelActiveStrokeColors` due to a copy-paste bug.

### Migration notes (0.x → 1.0)

- Node >= 18 is required for development.
- If you consumed `mapnj/lib/...` paths directly, switch to the package root import.
- Hover callbacks (`AREA_MOUSEOVER` etc.) keep their names but fire from Pointer Events now; touch devices no longer emit them.

## [0.3.0] - 2025-03-18

### Added

- Add transparentDefaultAreas Option
- Add transparentDefaultLabels Option 
- Add attributeValueSeparator Option

### Test

- Add some tests (for Area, Label) 

## [0.2.1] - 2024-09-13

### Documentation

- Add Super simple demo in README.

### Refactored

- Adjusting how main class methods are defined.
- Streamlined State Management.

### Test

- Add ResetSelector test file.

## [0.2.0] - 2024-08-16

### Changed

- Use `-` instead of `_` in mapnj part naming conventions

## [0.1.0] - 2024-07-25

### Added

- Initial Release
