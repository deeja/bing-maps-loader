# bing-maps-loader

_A Promise based Microsoft Bing Maps Web control loader that supports Server Side Rendering (SSR)_

[![npm](https://img.shields.io/npm/dy/bing-maps-loader)](https://www.npmjs.com/package/bing-maps-loader)
[![npm](https://img.shields.io/npm/v/bing-maps-loader)](https://www.npmjs.com/package/bing-maps-loader)

## Installation

### `yarn`

```bash
$ yarn add bing-maps-loader
$ yarn add bingmaps # A Bing maps type library from Microsoft
```

### `npm`

```bash
$ npm install bing-maps-loader --save
$ npm install bingmaps --save # A Bing maps type library from Microsoft
```

Written in ES6. Can be used on any website project or Framework.

This project DOES NOT wrap the `Microsoft.Map` object, so use this directly after loading.

- `BingMapsLoader` - Loads the [JS API from Bing](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control) directly. The `Promise` is resolved when loaded, or in the case it has already loaded, the `Promise` will resolve immediately. - Can be called multiple times. Will only initialize once. - Used to Hot load [Bing Map modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json) - `Promise` based

https://docs.microsoft.com/en-us/bingmaps/v8-web-control/

## Usage

After initializing, use the `Microsoft.Maps` object directly.

Note that if you wrap or proxy `Microsoft.Maps` , the `this` context may change and that can have weird breaking effects. e.g. _Type Errors_

### Client side only example (Non SSR)

```js
import "bingmaps"; // <--  Microsoft supported types library for Microsoft.Maps
import { initialize, whenLoaded } from "bing-maps-loader";

const API_KEY = "[Your API Key]";

initialize(API_KEY);

// Creating a map and adding a pin after API has been loaded
function addPinToNewMap() {
  // whenLoaded will resolve when the Map library is loaded
  whenLoaded().then(() => {
    const map = createMap("#map", { zoom: 6 }); // <-- can also use element references
    const volcanoLocation = createLocation(-39.2817, 175.5685);
    const volcanoPin = createPin(volcanoLocation, {
      title: "Ruapehu",
      subTitle: "Volcano",
      text: "5",
    });
    //Add the pushpin to the map
    map.entities.push(volcanoPin);
  });
}

// Use the window.Microsoft.Maps.Map object to create assets

const createMap = (element, options = null) => {
  return new Microsoft.Maps.Map(element, options);
};

const createLocation = (lat, lon) => {
  return new Microsoft.Maps.Location(lat, lon); // east london
};

const createPin = (location, properties = null) => {
  return new Microsoft.Maps.Pushpin(location, properties);
};
```

### SSR example - Also works client side

#### 1. Register the script

Either in the HTML itself

```html
<!-- callback must stay as GetMapCallback -->
<script
  data-n-head="ssr"
  src="https://www.bing.com/api/maps/mapcontrol?callback=GetMapCallback&amp;key=[MY API KEY]"
  defer
  async
></script>
```

Or using the provided `getApiUrl` with webpack

```js
const MAP_API_KEY = "ABCDEF";
import { getApiUrl } from "bing-maps-loader";
const mapJsUrl = getApiUrl(mapApiKey);

const htmlConfig = {
  head: {
    script: [
      {
        src: mapJsUrl,
        defer: true,
        async: true,
      },
    ],
  },
};
```

#### 2. Call `initializeSSR()` on both the server and the client

```js
import "bingmaps"; // <--  Microsoft supported types library for Microsoft.Maps
import { initializeSSR, whenLoaded } from "bing-maps-loader";

initializeSSR(); // should be called both on SSR AND in the client code

// Creating a map and adding a pin after API has been loaded
function addPinToNewMap() {
  // whenLoaded will resolve when the Map library is loaded
  whenLoaded().then(() => {
    /* map code as per the non SSR example */
  });
}
```

### Loading Bing Map Modules

Refer to [Bing Maps Modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)

```js
import "bingmaps";
import BingMapsLoader, { ModuleNames } from "bing-maps-loader";

const createHeatMapLayer = async function (locations) {
  await BingMapModuleLoader.loadModule(ModuleNames.HeatMap);
  return new Microsoft.Maps.HeatMapLayer(locations);
};
```

## Changelog

### 0.6.1 
- SSR Capability
- `initialize` method now returns `void` instead of a promise.
- Added `whenLoaded()` 

### 5.1 and below
- Sweeping changes. No code stability.


## Credits
Loosely copied off a promise based solution for loading JS, but I can't find the original source again!
If anyone knows, let me know.

