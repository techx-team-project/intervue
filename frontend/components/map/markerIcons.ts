import L from 'leaflet';

const PIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0z" fill="COLOR" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11.5" r="4.5" fill="#fff"/></svg>';

function pin(color: string) {
  return L.divIcon({
    className: 'map-pin',
    html: PIN_SVG.replace('COLOR', color),
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

export const jobPinIcon = pin('#00b14f');
export const selectedJobPinIcon = pin('#043d2d');
export const originPinIcon = pin('#212f3f');
