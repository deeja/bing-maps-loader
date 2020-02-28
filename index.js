export default function initialize(apiKey) {
  if (initialized) {
    return initPromise;
  }
  initialized = true;
  window[CALLBACK_NAME] = () => {
    microsoftMaps = window.Microsoft.Maps;
    resolveInitPromise(microsoftMaps);
  };
  addMapsScriptToHead(apiKey);
  return initPromise;
}

export class BingMapModuleLoader {
  static hasLoaded(moduleName) {
    if (!this.modules) {
      this.modules = [];
    }
    return this.modules.includes(moduleName);
  }

  static ensureModule(moduleName) {
    if (this.hasLoaded(moduleName)) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      window.Microsoft.Maps.loadModule(moduleName, () => {
        this.modules.push(moduleName);
        resolve();
      });
    });
  }
}

// Initial script taken from
// https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control

const CALLBACK_NAME = "GetMap";
const getApiUrl = function(apiKey) {
  return (
    "https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=" + apiKey
  );
};

let microsoftMaps = null;
let initialized = !!microsoftMaps;
let resolveInitPromise;
let rejectInitPromise;

const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

const addMapsScriptToHead = function(apiKey) {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = getApiUrl(apiKey);
  script.onerror = rejectInitPromise;
  document.querySelector("head").appendChild(script);
};
