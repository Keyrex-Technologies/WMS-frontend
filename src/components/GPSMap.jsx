// // GPSMap.jsx
// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Red marker icon for current user
// const redMarkerIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// function LocationMarker({ setLivePosition, direction, zoneRadius }) {
//   const [position, setPosition] = useState(null);
//   const [hasCentered, setHasCentered] = useState(false);
//   const [zoneRadiusInMeters] = useState(zoneRadius); // Zone radius (10 meters)
//   const map = useMap();

//   useEffect(() => {
//     const updateLocation = () => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const latlng = {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//           };

//           // Update the current location in state and localStorage
//           setPosition(latlng);
//           setLivePosition(latlng);

//           // Log the live location
//           console.log(`Live Location: Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`);

//           if (!hasCentered) {
//             map.flyTo(latlng, 21); // Zoomed in to level 21
//             setHasCentered(true);
//           }
//         },
//         (err) => console.error('Location error:', err.message),
//         { enableHighAccuracy: true }
//       );
//     };

//     // Call updateLocation every second
//     const intervalId = setInterval(updateLocation, 1000);

//     return () => {
//       clearInterval(intervalId); // Cleanup interval on component unmount
//     };
//   }, [map, hasCentered, setLivePosition]);

//   if (!position) return null;

//   const fixedLocation = { lat: 33.5536906, lng: 73.1023558 }; // Fixed location
//   const rotateIcon = direction ? { transform: `rotate(${direction}deg)` } : {}; // Direction

//   return (
//     <>
//       <Marker position={position} icon={redMarkerIcon} iconOptions={rotateIcon}>
//         <Popup>
//           <div className="p-2">
//             <p className="font-medium text-gray-900">Your Location</p>
//             <p className="text-sm text-gray-600">
//               Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
//             </p>
//           </div>
//         </Popup>
//       </Marker>
//       <Circle
//         center={fixedLocation} // Fixed location for the circle
//         radius={zoneRadiusInMeters}
//         pathOptions={{
//           color: 'blue',
//           fillColor: 'blue',
//           fillOpacity: 0.2,
//         }}
//       />
//     </>
//   );
// }

// function GPSMap({ setLivePosition, direction, zoneRadius, mapCenter }) {
//   return (
//     <MapContainer
//       center={mapCenter}
//       zoom={13}
//       scrollWheelZoom={false}
//       className="w-full h-96 z-10"
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <LocationMarker setLivePosition={setLivePosition} direction={direction} zoneRadius={zoneRadius} />
//     </MapContainer>
//   );
// }

// export default GPSMap;

// GPSMap.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const GPSMap = ({ setLivePosition, direction, zoneRadius = 5, mapCenter }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry']
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [map, setMap] = useState(null);
  const [isInZone, setIsInZone] = useState(false);
  const fixedLocation = useMemo(() => ({ lat: 33.5536906, lng: 73.1023558 }), []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  }, []);

  // Check zone status
  const checkZoneStatus = useCallback((position) => {
    if (!position) return false;
    const distance = calculateDistance(
      position.lat,
      position.lng,
      fixedLocation.lat,
      fixedLocation.lng
    );
    return distance <= zoneRadius;
  }, [fixedLocation, zoneRadius, calculateDistance]);

  // Marker icon
  const positionMarkerIcon = useMemo(() => {
    if (!window.google || !window.google.maps) return null;
    return {
      url: isInZone 
        ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    };
  }, [isInZone]);

  // Real-time location tracking
  useEffect(() => {
    if (!isLoaded) return;

    let watchId = null;

    const successCallback = (position) => {
      const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      const insideZone = checkZoneStatus(latlng);
      setIsInZone(insideZone);
      setCurrentPosition(latlng);
      setLivePosition({ ...latlng, isInZone: insideZone });

      if (map) {
        map.panTo(latlng);
      }
    };

    const errorCallback = (error) => {
      console.error('Error getting location:', error.message);
    };

    // Use watchPosition instead of getCurrentPosition for continuous updates
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        successCallback,
        errorCallback,
        { 
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isLoaded, map, setLivePosition, checkZoneStatus]);

  const onLoad = useCallback((map) => {
    setMap(map);
    // Set initial view to include both fixed location and current position
    if (currentPosition) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(new window.google.maps.LatLng(fixedLocation.lat, fixedLocation.lng));
      bounds.extend(new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng));
      map.fitBounds(bounds);
    }
  }, [currentPosition, fixedLocation]);

  if (loadError) return <div className="p-4 text-red-600">Error loading map</div>;
  if (!isLoaded) return <div className="p-4">Loading map...</div>;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-md relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={19}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'greedy',
          disableDefaultUI: true
        }}
      >
        {/* Fixed location marker (blue) */}
        <Marker
          position={fixedLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }}
        />

        {/* Zone radius circle - ALWAYS VISIBLE */}
        <Circle
          center={fixedLocation}
          radius={zoneRadius}
          options={{
            strokeColor: '#4285F4',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: isInZone ? '#0F9D58' : '#DB4437',
            fillOpacity: 0.2,
            clickable: false,
            zIndex: 1
          }}
        />

        {/* Current position marker (red/green) */}
        {currentPosition && positionMarkerIcon && (
          <Marker
            position={currentPosition}
            icon={{
              ...positionMarkerIcon,
              rotation: direction || 0
            }}
            onClick={() => setShowInfoWindow(true)}
          >
            {showInfoWindow && (
              <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                <div>
                  <p className="font-semibold">Your Location</p>
                  <p>Lat: {currentPosition.lat.toFixed(6)}</p>
                  <p>Lng: {currentPosition.lng.toFixed(6)}</p>
                  <p>Accuracy: ±{currentPosition.accuracy?.toFixed(0)}m</p>
                  <p className={isInZone ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {isInZone ? 'Inside the zone' : 'Outside the zone'}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>

      {/* Zone status indicator */}
      <div className={`absolute top-4 right-4 p-3 rounded-lg shadow-md ${isInZone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <p className="font-bold">{isInZone ? 'INSIDE ZONE' : 'OUTSIDE ZONE'}</p>
        <p className="text-sm">Radius: {zoneRadius}m</p>
      </div>
    </div>
  );
};

export default React.memo(GPSMap);