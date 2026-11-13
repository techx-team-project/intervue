export interface GeocodeResult {
  lat: number;
  lng: number;
}

const PHOTON_SEARCH_URL = 'https://photon.komoot.io/api/';
const VIETNAM_BBOX = '102.1,8.4,109.5,23.4';

type PhotonResponse = { features: Array<{ geometry: { coordinates: [number, number] } }> };

export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ q: query, limit: '1', bbox: VIETNAM_BBOX });
  const response = await fetch(`${PHOTON_SEARCH_URL}?${params.toString()}`, { signal });
  if (!response.ok) throw new Error('Geocoding failed');
  const { features } = (await response.json()) as PhotonResponse;
  if (features.length === 0) return null;
  const [lng, lat] = features[0].geometry.coordinates;
  return { lat, lng };
}
