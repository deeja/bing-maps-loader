const modules: string[] = [];

const hasLoaded = (moduleName: string): boolean => {
  return modules.includes(moduleName);
};

export const ensureModule = (moduleName: string) => {
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
