import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const GPSMap = ({
  setLivePosition,
  zoneRadius = 10,
  mapCenter,
  isInZone,
  setIsInZone,
  userHeading,
  setIsClockIn,
  setClockInTime,
  setClockOutTime,
  isClockIn,
  setUserHeading,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [positionValid, setPositionValid] = useState(false);

  // Device orientation fallback for heading
  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.absolute && event.alpha !== null) {
        const heading = 360 - event.alpha;
        setUserHeading(Math.round(heading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [setUserHeading]);

  const calculateDistance = useCallback((origin, destination) => {
    if (!window.google || !window.google.maps || !origin || !destination) return 0;

    const originLatLng = new window.google.maps.LatLng(origin.lat, origin.lng);
    const destinationLatLng = new window.google.maps.LatLng(destination.lat, destination.lng);

    return window.google.maps.geometry.spherical.computeDistanceBetween(originLatLng, destinationLatLng);
  }, []);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng));
    mapInstance.fitBounds(bounds);
    mapInstance.setZoom(18);
  }, [mapCenter]);

  useEffect(() => {
    if (!isLoaded) return;

    let watchId;

    const handlePositionUpdate = (position) => {
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy || 9999,
        heading: position.coords.heading,
      };

      console.log('GPS Heading:', position);
      if (newPos.heading !== null) {
        setUserHeading(Math.round(newPos.heading));
      }

      const accuracyThreshold = 100;

      if (newPos.accuracy > accuracyThreshold) {
        setPositionValid(false);
        return;
      }

      const distance = calculateDistance(newPos, mapCenter);
      const insideZone = distance <= zoneRadius;

      const distanceMoved = currentPosition
        ? calculateDistance(currentPosition, newPos)
        : Number.POSITIVE_INFINITY;

      if (distanceMoved > 2) {
        setCurrentPosition(newPos);
        setPositionValid(true);
        setIsInZone(insideZone);
        setLivePosition({
          ...newPos,
          isInZone: insideZone,
          distance,
        });

        if (map) {
          map.panTo(newPos);
        }

        if (insideZone && !isClockIn) {
          setIsClockIn(true);
          setClockInTime(new Date());
        }

        if (!insideZone && isClockIn) {
          setIsClockIn(false);
          setClockOutTime(new Date());
        }
      }
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        (err) => {
          console.error('Geolocation error:', err);
          setPositionValid(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [
    isLoaded,
    map,
    mapCenter,
    zoneRadius,
    calculateDistance,
    currentPosition,
    setIsInZone,
    setLivePosition,
    isClockIn,
    setIsClockIn,
    setClockInTime,
    setClockOutTime,
    setUserHeading,
  ]);

  if (loadError) return <div className="p-4 text-red-600">Error loading map</div>;
  if (!isLoaded) return <div className="p-4">Loading map...</div>;
  if (!positionValid) return <div className="w-full h-[400px] flex items-center justify-center">Response is updating...</div>;

  const markerIcon = {
    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: isInZone ? '#0F9D58' : '#EA4335',
    fillOpacity: 1,
    scale: 5,
    rotation: userHeading ?? 0,
    strokeColor: '#000',
    strokeWeight: 1,
    anchor: new window.google.maps.Point(0, 2),
  };

  const distance = currentPosition ? Math.round(calculateDistance(currentPosition, mapCenter)) : null;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        onLoad={onLoad}
        options={{
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: 'greedy',
        }}
      >
        <Marker
          position={mapCenter}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32),
          }}
          zIndex={2}
        />

        <Circle
          center={mapCenter}
          radius={zoneRadius}
          options={{
            strokeColor: '#0F9D58',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0F9D58',
            fillOpacity: 0.2,
            clickable: false,
            zIndex: 1,
          }}
        />

        {currentPosition && <Marker position={currentPosition} icon={markerIcon} zIndex={3} />}
      </GoogleMap>

      <div
        className={`absolute bottom-4 left-4 p-3 rounded-lg shadow-md ${isInZone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        <p className="font-bold">{isInZone ? 'INSIDE OFFICE ZONE' : 'OUTSIDE OFFICE ZONE'}</p>
        <p className="text-sm">Zone Radius: {zoneRadius}m</p>
        {distance !== null && (
          <p className="text-sm">
            Distance: {distance}m • Heading: {userHeading ?? 'N/A'}°
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(GPSMap);
