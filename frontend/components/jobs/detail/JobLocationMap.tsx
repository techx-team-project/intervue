'use client';

import { jobPinIcon } from '@/components/map/markerIcons';
import { MAP_ATTRIBUTION, MAP_TILE_URL } from '@/constants/map';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

const MAP_ZOOM = 15;

function ResizeWithContainer() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

type JobLocationMapProps = {
  latitude: number;
  longitude: number;
};

export default function JobLocationMap({ latitude, longitude }: JobLocationMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={MAP_ZOOM}
      scrollWheelZoom={false}
      className="h-full min-h-64 w-full"
    >
      <ResizeWithContainer />
      <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
      <Marker position={[latitude, longitude]} icon={jobPinIcon} />
    </MapContainer>
  );
}
