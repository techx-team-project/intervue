export const MAP_DEFAULT_CENTER = { lat: 10.7769, lng: 106.7009 } as const;
export const MAP_DEFAULT_ZOOM = 12;
export const MAP_PICKER_ZOOM = 16;
export const MAP_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
export const MAP_ATTRIBUTION = 'Tiles &copy; Esri';
export const NEARBY_RADIUS_OPTIONS = [3, 5, 10, 20, 50] as const;
export const NEARBY_DEFAULT_RADIUS_KM = 10;
