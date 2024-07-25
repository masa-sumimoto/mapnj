# MapNJ

![MapNJ Screenshot](https://mapnj.masa-sumimoto.com/public/readme-hero.png)

日本語の解説サイトは[こちら](https://mapnj.masa-sumimoto.com/)。

↑I will eventually translate the explanatory site into English.

A script to add interactivity to SVG-based illustration maps

- Manipulates SVG illustrations
- Manages the selection and deselection states of SVG illustration parts
- Separates design and code roles in production
- Customizes SVG illustration fill and line colors based on context
- Allows for the addition of related parts involved in operations

Check out the [demo](https://mapnj.masa-sumimoto.com/demo-nexsus-of-r/) to see it in action.

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
<script src="https://cdn.jsdelivr.net/npm/mapnj@0.1/dist/MapNJ.min.js"></script>
```

This will always load the latest version of 0.1.x. If you want to lock it down to a specific version, you can do:

```
<script src="https://cdn.jsdelivr.net/npm/mapnj@0.1.0/dist/MapNJ.min.js"></script>
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
    <path id="mapnj_area_xxx" d="" />
    <path id="mapnj_label_xxx" d="" />

    <!-- mapping to group nodes -->
    <g id="mapnj_area_xxx"><path d="" /><path d="" /></g>
    <g id="mapnj_label_xxx"><path d="" /><path d="" /></g>
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
