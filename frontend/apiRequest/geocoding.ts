export interface GeocodeResult {
  lat: number;
  lng: number;
}

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'vn', q: query });
  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
    signal,
    headers: { 'Accept-Language': 'vi' },
  });
  if (!response.ok) throw new Error('Geocoding failed');
  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (results.length === 0) return null;
  return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
}
