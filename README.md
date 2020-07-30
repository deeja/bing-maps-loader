
# bing-maps-loader - NPM Website JS Package
 _A Promise based Microsoft Bing Maps Web control loader_

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

- `BingMapsLoader`
	- Loads the [JS API from Bing](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control) directly. The `Promise` is resolved when loaded, or in the case it has already loaded, the `Promise` will resolve immediately.
	- Can be called multiple times. Will only initialize once. 
	- Used to Hot load [Bing Map modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)
	- `Promise` based



https://docs.microsoft.com/en-us/bingmaps/v8-web-control/

## Usage 
After initializing, use the  `Microsoft.Maps` object directly.

Note that if you wrap or proxy `Microsoft.Maps` , the `this` context may change and that can have weird breaking effects. e.g. _Type Errors_ 

### Simple Example
```js
import "bingmaps";
import BingMapsLoader from "bing-maps-loader";

const API_KEY = "[Your API Key]";

// Creating a map and adding a pin after API has been loaded
function addPinToNewMap() {  
  // Run initializer to ensure the JS API has been loaded 
  BingMapsLoader.initialize(API_KEY).then(() => {  
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
  return new Microsoft.Maps.Map(element, options);
};

const createLocation = (lat, lon) => {
  return new Microsoft.Maps.Location(lat, lon); // east london
};

const createPin = (location, properties = null) => {
  return new Microsoft.Maps.Pushpin(location, properties);
};
```
### Loading Bing Map Modules

Refer to [Bing Maps Modules](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/modules/?toc=https://docs.microsoft.com/en-us/bingmaps/v8-web-control/toc.json&bc=https://docs.microsoft.com/en-us/BingMaps/breadcrumb/toc.json)

```js
import "bingmaps";
import BingMapsLoader, {ModuleNames} from  "bing-maps-loader";

const  createHeatMapLayer  =  async function(locations) {
	await  BingMapModuleLoader.loadModule(ModuleNames.HeatMap);
	return new Microsoft.Maps.HeatMapLayer(locations);
};
```

## Credits
Loosely copied off a promise based solution for loading JS, but I can't find the original source again! 
If anyone knows, let me know. 
