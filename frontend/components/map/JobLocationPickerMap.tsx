'use client';

import { MAP_ATTRIBUTION, MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MAP_PICKER_ZOOM, MAP_TILE_URL } from '@/constants/map';
import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { jobPinIcon } from './markerIcons';

export interface MapPoint {
  lat: number;
  lng: number;
}

interface JobLocationPickerMapProps {
  value: MapPoint | null;
  onChange: (point: MapPoint) => void;
}

function ClickToPick({ onChange }: { onChange: (point: MapPoint) => void }) {
  useMapEvents({
    click: (event) => onChange({ lat: event.latlng.lat, lng: event.latlng.lng }),
  });
  return null;
}

function FlyToValue({ value }: { value: MapPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (value) map.flyTo([value.lat, value.lng], Math.max(map.getZoom(), MAP_PICKER_ZOOM), { duration: 0.6 });
  }, [map, value]);
  return null;
}

export default function JobLocationPickerMap({ value, onChange }: JobLocationPickerMapProps) {
  const center = value ?? MAP_DEFAULT_CENTER;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={value ? MAP_PICKER_ZOOM : MAP_DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-64 w-full rounded-xl"
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
      <ClickToPick onChange={onChange} />
      <FlyToValue value={value} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={jobPinIcon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = (event.target as LeafletMarker).getLatLng();
              onChange({ lat, lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
