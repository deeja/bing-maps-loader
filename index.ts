declare global {
  interface Window { [key:string]: any  }
}

export default function initialize(apiKey: string) {
  if (initialized) {
    return initPromise;
  }
  initialized = true;

  window[CALLBACK_NAME] = () => {
    microsoftMaps = window.Microsoft.Maps as any;
    resolveInitPromise(microsoftMaps);
  };
  addMapsScriptToHead(apiKey);
  return initPromise;
}

export const Maps = () => {
  return window.Microsoft.Maps;
};

export class BingMapModuleLoader {
  static modules: string[] = [];

  static hasLoaded(moduleName: string) {
    return this.modules.includes(moduleName);
  }

  static ensureModule(moduleName: string) {
    if (this.hasLoaded(moduleName)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
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
const getApiUrl = function (apiKey: string) {
  return (
    "https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=" + apiKey
  );
};

export let microsoftMaps = null;

let initialized = !!microsoftMaps;
let resolveInitPromise: Function;
let rejectInitPromise: OnErrorEventHandler;

const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

const addMapsScriptToHead = function (apiKey: string) {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = getApiUrl(apiKey);
  script.onerror = rejectInitPromise;
  document.querySelector("head")?.appendChild(script);
};
