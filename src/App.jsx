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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/marker-icon-2x.png",
  iconUrl: "/icons/marker-icon.png",
  shadowUrl: "/icons/marker-shadow.png",
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
        <div className="search-box">
          <small>Search (top-left on map):</small>
          <div style={{ fontSize: 12, color: "#555" }}>
            Use location search box on the map to fly to places
          </div>
        </div>
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
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {LOCATIONS.map((loc) => {
            const icon = loc.icon
              ? L.icon({
                  iconUrl: loc.icon,
                  iconSize: [36, 36],
                  iconAnchor: [18, 36],
                })
              : undefined;
            return (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
                <Popup>
                  <strong>{loc.name}</strong>
                  <div style={{ fontSize: 13 }}>{loc.desc}</div>
                </Popup>
              </Marker>
            );
          })}

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
