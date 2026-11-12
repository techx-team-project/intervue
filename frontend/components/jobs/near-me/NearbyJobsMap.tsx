'use client';

import { jobPinIcon, originPinIcon, selectedJobPinIcon } from '@/components/map/markerIcons';
import { MAP_ATTRIBUTION, MAP_TILE_URL } from '@/constants/map';
import type { NearbyJobResource } from '@/types/public-job';
import { formatSalary } from '@/utils/public-company';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';

export interface MapOrigin {
  lat: number;
  lng: number;
}

interface NearbyJobsMapProps {
  origin: MapOrigin;
  radiusKm: number;
  jobs: NearbyJobResource[];
  selectedJobId: number | null;
  onSelect: (jobId: number) => void;
  onOriginChange: (origin: MapOrigin) => void;
}

const METERS_PER_KM = 1000;
const ORIGIN_ZOOM_BY_RADIUS = (radiusKm: number) =>
  radiusKm <= 3 ? 14 : radiusKm <= 10 ? 12 : radiusKm <= 20 ? 11 : 9;

function ClickToMoveOrigin({ onOriginChange }: { onOriginChange: (origin: MapOrigin) => void }) {
  useMapEvents({
    click: (event) => onOriginChange({ lat: event.latlng.lat, lng: event.latlng.lng }),
  });
  return null;
}

function Focus({
  origin,
  radiusKm,
  selected,
}: {
  origin: MapOrigin;
  radiusKm: number;
  selected: NearbyJobResource | undefined;
}) {
  const map = useMap();
  useEffect(() => {
    if (selected) map.flyTo([selected.latitude, selected.longitude], Math.max(map.getZoom(), 14), { duration: 0.5 });
    else map.flyTo([origin.lat, origin.lng], ORIGIN_ZOOM_BY_RADIUS(radiusKm), { duration: 0.5 });
  }, [map, origin, radiusKm, selected]);
  return null;
}

export default function NearbyJobsMap({
  origin,
  radiusKm,
  jobs,
  selectedJobId,
  onSelect,
  onOriginChange,
}: NearbyJobsMapProps) {
  const selected = jobs.find((item) => item.job.id === selectedJobId);

  return (
    <MapContainer
      center={[origin.lat, origin.lng]}
      zoom={ORIGIN_ZOOM_BY_RADIUS(radiusKm)}
      scrollWheelZoom
      className="h-full min-h-80 w-full"
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
      <ClickToMoveOrigin onOriginChange={onOriginChange} />
      <Focus origin={origin} radiusKm={radiusKm} selected={selected} />
      <Circle
        center={[origin.lat, origin.lng]}
        radius={radiusKm * METERS_PER_KM}
        pathOptions={{ color: '#00b14f', weight: 1, fillOpacity: 0.06 }}
      />
      <Marker position={[origin.lat, origin.lng]} icon={originPinIcon} interactive={false} />
      {jobs.map((item) => (
        <Marker
          key={item.job.id}
          position={[item.latitude, item.longitude]}
          icon={item.job.id === selectedJobId ? selectedJobPinIcon : jobPinIcon}
          eventHandlers={{ click: () => onSelect(item.job.id) }}
        >
          <Popup>
            <div className="space-y-1">
              <Link href={`/jobs/${item.job.id}`} className="text-primary text-sm font-bold hover:underline">
                {item.job.title}
              </Link>
              <p className="text-on-surface-variant text-xs">{item.job.company.name}</p>
              <p className="text-on-surface-variant text-xs">
                {formatSalary(item.job.salary)} · {item.distanceKm} km away
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
