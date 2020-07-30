// Initial script taken from
// https://docs.microsoft.com/en-us/bingmaps/v8-web-control/creating-and-hosting-map-controls/creating-a-basic-map-control

if (typeof window === "undefined") {
  throw Error(
    "Bing Maps Loader :: Not running in a browser - SSR not supported yet"
  );
}

const CALLBACK_NAME: string = "GetMapCallback";

let mapsLoaded = () => !!window.Microsoft?.Maps;
let initialized = mapsLoaded();
let resolver: any;
let rejecter: OnErrorEventHandler;

const getApiUrl = function (apiKey: string) {
  return `https://www.bing.com/api/maps/mapcontrol?callback=${CALLBACK_NAME}&key=${apiKey}`;
};

/**
 * Fire off the request to load the API, then set and wait for the callback
 * The promise resolves when the callback completes;
 * @param apiKey
 * @param modulesToLoad Use the Module names list to populate
 */
const initialize = (
  apiKey: string,
  ...modulesToLoad: string[]
): Promise<void> => {
  if (mapsLoaded()) {
    return loadModules(modulesToLoad);
  }
  if (initialized) {
    return initPromise;
  }
  initialized = true;
  //@ts-ignore
  window[CALLBACK_NAME] = async () => {
    await loadModules(modulesToLoad);
    resolver();
  };
  addMapsScriptToHead(apiKey);
  return initPromise;
};

function loadModules(modulesToLoad: string[]) {
  const loadPromises = modulesToLoad.map((moduleToLoad) => {   
    return loadModule(moduleToLoad);
  });
  return Promise.all(loadPromises).then(() => Promise.resolve());
}

/** Sets up Promises for the CALLBACK
 */
const initPromise = new Promise<void>((resolve, reject) => {
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

export const ModuleNames = {
  AutoSuggest: "Microsoft.Maps.Autosuggest",
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

export default { initialize, loadModule };
