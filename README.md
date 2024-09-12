# MapNJ

![MapNJ Screenshot](https://mapnj.masa-sumimoto.com/public/readme-hero.png)

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

## API Documentation

For detailed API documentation, please visit the [Advanced Usage](https://mapnj.masa-sumimoto.com/advanced-usage/) section on the official website.

## License

This project is licensed under the MIT License. See the LICENSE file in the project root for full license information.

# Changelog

## [0.2.0] - 2024-08-16

### Changed

- Use `-` instead of `_` in mapnj part naming conventions

## [0.1.0] - 2024-07-25

### Added

- Initial Release
