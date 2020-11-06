// Initial script taken from
// https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control

const CALLBACK_NAME: string = "GetMapCallback";
const LOADED_CHECK: string = "MicrosoftMapsLoaded";

const inBrowser = () => {
  return typeof window !== "undefined";
};

const mapsLoaded = (): boolean => {
  return inBrowser() && (window as any)[LOADED_CHECK];
};

let initialized = false;
let resolver: any;
let rejecter: OnErrorEventHandler;

const getApiUrl = function (apiKey: string) {
  return `https://www.bing.com/api/maps/mapcontrol?callback=${CALLBACK_NAME}&key=${apiKey}`;
};

/**
 * Fire off the request to load the API
 * @param apiKey
 * @param modulesToLoad Use the Module names list to populate
 */
const initialize = (apiKey: string, ...modulesToLoad: string[]) => {
  if (!inBrowser()) {
    throw Error(
      "Bing Maps Loader :: Not running in a browser \n Call initializeSSR() in combination with getApiUrl(). Info in the bing-maps-loader README "
    );
  }
  if (mapsLoaded()) {
    return loadModules(modulesToLoad);
  }
  if (!initialized) {
    initialized = true;
    setCallback(modulesToLoad);
    addMapsScriptToHead(apiKey);
  }
};

/**
 * For SSR implementations, the script url + api key will already be in the HTML head.
 * @param modulesToLoad Use the Module names list to populate
 */
const initializeSSR = (...modulesToLoad: string[]) => {
  if (initialized) {
    return;
  }
  if (inBrowser()) {
    setCallback(modulesToLoad);
  }
  initialized = true;
  //@ts-ignore
};

const setCallback = (modulesToLoad: string[]) => {
  const win = window as any;
  //@ts-ignore
  win[CALLBACK_NAME] = async () => {
    await loadModules(modulesToLoad);
    resolver();
  };

  if (mapsLoaded()) {
    win[CALLBACK_NAME]();
    win[CALLBACK_NAME] = null;
  }
};

function loadModules(modulesToLoad: string[]) {
  const loadPromises = modulesToLoad.map((moduleToLoad) => {
    return loadModule(moduleToLoad);
  });
  return Promise.all(loadPromises).then(() => Promise.resolve());
}

/** Sets up Promises for the CALLBACK
 */
const whenLoaded = new Promise<void>((resolve, reject) => {
  resolver = resolve;
  rejecter = reject;
});

const addMapsScriptToHead = function (apiKey: string) {
  const script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = getApiUrl(apiKey);
  script.onerror = rejecter;
  document.querySelector("head")?.appendChild(script);
};

const modules: string[] = [];

const hasLoaded = (moduleName: string): boolean => {
  return modules.includes(moduleName);
};

const loadModule = (moduleName: string) => {
  if (hasLoaded(moduleName)) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    Microsoft.Maps.loadModule(moduleName, () => {
      modules.push(moduleName);
      resolve();
    });
  });
};

const moduleNames = {
  AutoSuggest: "Microsoft.Maps.AutoSuggest",
  Clustering: "Microsoft.Maps.Clustering",
  Contour: "Microsoft.Maps.Contour",
  DataBinning: "Microsoft.Maps.DataBinning",
  Directions: "Microsoft.Maps.Directions",
  DrawingTools: "Microsoft.Maps.DrawingTools",
  GeoJson: "Microsoft.Maps.GeoJson",
  GeoXml: "Microsoft.Maps.GeoXml",
  HeatMap: "Microsoft.Maps.HeatMap",
  Search: "Microsoft.Maps.Search",
  SpatialDataService: "Microsoft.Maps.SpatialDataService",
  SpatialMath: "Microsoft.Maps.SpatialMath",
  Traffic: "Microsoft.Maps.Traffic",
  WellKnownText: "Microsoft.Maps.WellKnownText",
  VenueMaps: "Microsoft.Maps.VenueMaps",
};

export {
  initialize,
  whenLoaded,
  initializeSSR,
  getApiUrl,
  loadModule,
  moduleNames,
};
