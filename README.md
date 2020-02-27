
# bing-maps-loader - NPM Website JS Package
 _A Promise based Microsoft Bing Maps Web control loader_

<a href="https://npmjs.org/package/badges" title="View this project on NPM"><img src="https://img.shields.io/npm/v/bing-maps-loader.svg" alt="NPM version" /></a>
<a href="https://npmjs.org/package/badges" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/bing-maps-loader.svg" alt="NPM downloads" /></a>

Written in ES6. Can be used on any website project or Framework. 
This project DOES NOT wrap the `window.Microsoft.Map` object, so use this directly after loading.


- `BingMapsLoader`
	- Loads the [JS API from Bing](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control) directly. The `Promise` is resolved when loaded, or in the case it has already loaded, the `Promise` will resolve immediately.
	- Can be called multiple times. Will only initialize once. 
- `BingMapModuleLoader`
	- Used to Hot load [Bing Map modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)
	- `Promise` based



https://docs.microsoft.com/en-us/bingmaps/v8-web-control/

## Usage 
After initializing, use the  `window.Microsoft.Maps` object directly.

Note that if you wrap or proxy `window.Microsoft.Maps` , the `this` context may change and that can have weird breaking effects. e.g. _Type Errors_ 

### Simple Example
```js
import BingMapsLoader from "bing-maps-loader";

const API_KEY = "[Your API Key]";

// Creating a map and adding a pin after API has been loaded
function addPinToNewMap() {  
  // Run initializer to ensure the JS API has been loaded 
  BingMapsLoader(API_KEY).then(() => {  
    const map = createMap("#map", { zoom: 6 }); // <-- can also use element references
    const volcanoLocation = createLocation(-39.2817, 175.5685);
    const volcanoPin = createPin(volcanoLocation, {
      title: "Ruapehu",
      subTitle: "Volcano",
      text: "5"
    });
    //Add the pushpin to the map
    map.entities.push(volcanoPin);
  });
}

// Use the window.Microsoft.Maps.Map object to create assets

const createMap = (element, options = null) => {
  return new window.Microsoft.Maps.Map(element, options);
};

const createLocation = (lat, lon) => {
  return new window.Microsoft.Maps.Location(lat, lon); // east london
};

const createPin = (location, properties = null) => {
  return new window.Microsoft.Maps.Pushpin(location, properties);
};
```
### Loading Bing Map Modules

Refer to [Bing Maps Modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)

```js
import { BingMapModuleLoader } from  "bing-maps-loader";

const  MODULE_HEAT_MAP  =  "Microsoft.Maps.HeatMap";

const  createHeatMapLayer  =  async function(locations) {
	await  BingMapModuleLoader.ensureModule(MODULE_HEAT_MAP);
	return  new  window.Microsoft.Maps.HeatMapLayer(locations);
};
```

## Credits
Loosely copied off a promise based solution for loading JS, but I can't find the original source again! 
If anyone knows, let me know. 
