// GPSMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Red marker icon for current user
const redMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ setLivePosition, direction, zoneRadius }) {
  const [position, setPosition] = useState(null);
  const [hasCentered, setHasCentered] = useState(false);
  const [zoneRadiusInMeters] = useState(zoneRadius); // Zone radius (10 meters)
  const map = useMap();

  useEffect(() => {
    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          // Update the current location in state and localStorage
          setPosition(latlng);
          setLivePosition(latlng);

          // Log the live location
          console.log(`Live Location: Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`);

          if (!hasCentered) {
            map.flyTo(latlng, 21); // Zoomed in to level 21
            setHasCentered(true);
          }
        },
        (err) => console.error('Location error:', err.message),
        { enableHighAccuracy: true }
      );
    };

    // Call updateLocation every second
    const intervalId = setInterval(updateLocation, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [map, hasCentered, setLivePosition]);

  if (!position) return null;

  const fixedLocation = { lat: 33.5536906, lng: 73.1023558 }; // Fixed location
  const rotateIcon = direction ? { transform: `rotate(${direction}deg)` } : {}; // Direction

  return (
    <>
      <Marker position={position} icon={redMarkerIcon} iconOptions={rotateIcon}>
        <Popup>
          <div className="p-2">
            <p className="font-medium text-gray-900">Your Location</p>
            <p className="text-sm text-gray-600">
              Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>
      <Circle
        center={fixedLocation} // Fixed location for the circle
        radius={zoneRadiusInMeters}
        pathOptions={{
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
        }}
      />
    </>
  );
}

function GPSMap({ setLivePosition, direction, zoneRadius, mapCenter }) {
  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-96 z-10"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setLivePosition={setLivePosition} direction={direction} zoneRadius={zoneRadius} />
    </MapContainer>
  );
}

export default GPSMap;
