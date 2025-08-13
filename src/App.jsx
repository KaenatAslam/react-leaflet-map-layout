import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { LOCATIONS, PATHS } from "./config";

// Custom blue marker
const customIcon = L.icon({
  iconUrl: "/icons/custom-blue-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

function FlyTo({ position, zoom = 15 }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, zoom, { duration: 0.6 });
  }
  return null;
}

export default function App() {
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const addSearch = (map) => {
    if (!map) return;
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
    });
    map.addControl(searchControl);
  };

  const handleListClick = (loc) => {
    setSelected([loc.lat, loc.lng]);
    const map = mapRef.current;
    if (map) map.flyTo([loc.lat, loc.lng], 15, { duration: 0.6 });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 style={{ marginTop: 0 }}>Locations</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {LOCATIONS.map((loc) => (
            <li
              key={loc.id}
              className="location-item"
              onClick={() => handleListClick(loc)}
            >
              <strong>{loc.name}</strong>
              <div style={{ fontSize: 13, color: "#555" }}>{loc.desc}</div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="map-wrap">
        <MapContainer
          whenCreated={(m) => {
            mapRef.current = m;
            addSearch(m);
          }}
          center={[LOCATIONS[0].lat, LOCATIONS[0].lng]}
          zoom={13}
          className="leaflet-container"
        >
          {/* Carto Positron clean theme */}
          <TileLayer
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>'
          />

          {LOCATIONS.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={customIcon}
            >
              <Popup>
                <strong>{loc.name}</strong>
                <div style={{ fontSize: 13 }}>{loc.desc}</div>
              </Popup>
            </Marker>
          ))}

          {PATHS.map((coords, i) => (
            <Polyline
              key={i}
              positions={coords}
              pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
            />
          ))}

          {selected && <FlyTo position={selected} />}
        </MapContainer>
      </div>
    </div>
  );
}
