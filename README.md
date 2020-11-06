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
  whenLoaded.then(() => {
    const map =  new Microsoft.Maps.Map("#map", { zoom: 6 }); // <-- can also use references e.g. Vue $refs, React.createRef()
    const location = new Microsoft.Maps.Location(-39.2817, 175.5685);
    const pin = new Microsoft.Maps.Pushpin((location, {
      title: "Ruapehu",
      subTitle: "Volcano",
      text: "5",
    });
    //Add the pushpin to the map
    map.entities.push(pin);
  });
}
```

### SSR example - Also works client side

#### 1. Register the script

Either in the HTML itself

```html
<!-- callback must stay as GetMapCallback -->
<script
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

#### 2. OPTIONAL - Add this JS script in the head (or in a early loaded js)

If your JS code is late loading, then Microsoft Maps JS may have loaded before your code.
The `Microsoft.Maps` object can exist before the library is ready to be used. 
Internally, the `bing-maps-loader` looks on the window object for a property of `MicrosoftMapsLoaded`, which is assigned by the following code:

```html
<script>
  window["GetMapCallback"] = () => (window["MicrosoftMapsLoaded"] = true);
</script>
```

The above could also be called via a non-async, non-deferred JS script. 


#### 3. Call `initializeSSR()` on both the server and the client

```js
import "bingmaps"; // <--  Microsoft supported types library for Microsoft.Maps
import { initializeSSR, whenLoaded } from "bing-maps-loader";

initializeSSR(); // should be called both on SSR AND in the client code

// Creating a map and adding a pin after API has been loaded
function addPinToNewMap() {
  // whenLoaded will resolve when the Map library is loaded
  whenLoaded.then(() => {
    /* map code as per the non SSR example */
  });
}
```

### Loading Bing Map Modules

Refer to [Bing Maps Modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)

```js
import "bingmaps";
import { initialize, whenLoaded, moduleNames } from "bing-maps-loader";

const createHeatMapLayer = async function (locations) {
  await BingMapModuleLoader.loadModule(moduleNames.HeatMap);
  return new Microsoft.Maps.HeatMapLayer(locations);
};
```

### Vue.js Example : Auto suggest without maps
Initialize the library on start up
```js
import { initialize } from "bing-maps-loader";
initialize("[ My API Key ]");  // if using SSR, read the instructions above.
```

Use the promises to handle the loading of the modules
```vue
<template>
  <div>
    <div ref="searchBoxContainer">
      <input
        class="bg-blue"
        placeholder="hey there"
        type="text"
        ref="searchBox"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { whenLoaded, loadModule, moduleNames } from "bing-maps-loader";
export default Vue.extend({
  data(): { data: any } {
    return { data: null };
  },
  mounted() {
    whenLoaded    
      .then(() => loadModule(moduleNames.AutoSuggest))
      .then(() => {    
        var manager = new Microsoft.Maps.AutosuggestManager(options);
        manager.attachAutosuggest(
          (this.$refs as any).searchBox,
          (this.$refs as any).searchBoxContainer,
          (result) => {
            alert(JSON.stringify(result, null, 2))
          }
        );
      });
  },
});
</script>
```


## Changelog

### 1.0.2
 - Casing on module name was incorrect `Microsoft.Maps.Autosuggest` -> `Microsoft.Maps.AutoSuggest`
 
### 1.0.1
 - Change ModuleNames to moduleNames
 - General clean 

### 0.6.3 

- Documentation only. Typo: `whenLoaded()`, should be `whenLoaded`

### 0.6.2

- SSR Race condition modification `MicrosoftMapsLoaded`

### 0.6.1

- SSR Capability
- `initialize` method now returns `void` instead of a promise.
- Added `whenLoaded`

### 5.1 and below

- Sweeping changes. No code stability.

## Credits

Loosely copied off a promise based solution for loading JS, but I can't find the original source again!
If anyone knows, let me know.
