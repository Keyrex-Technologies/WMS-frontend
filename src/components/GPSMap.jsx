import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import Cookies from 'js-cookie';

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
  const { socket, isConnected } = useSocket();
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [positionValid, setPositionValid] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

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
    let lastPosition = null;

    const handlePositionUpdate = (position) => {
      const now = Date.now();
      // Throttle updates to at most once per second
      if (now - lastUpdateTime < 1000) return;
      // console.log(position)
      const newPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy || 9999,
        heading: position.coords.heading,
        timestamp: position.timestamp,
      };

      // Update heading if available from GPS
      if (newPos.heading !== null && !isNaN(newPos.heading)) {
        setUserHeading(Math.round(newPos.heading));
      }

      const accuracyThreshold = 30; // More strict accuracy threshold (30 meters)

      if (newPos.accuracy > accuracyThreshold) {
        setPositionValid(false);
        // return;
      }

      setPositionValid(true);
      setLastUpdateTime(now);

      // Always update position regardless of distance moved
      // console.log(newPos)
      setCurrentPosition(newPos);

      const distance = calculateDistance(newPos, mapCenter);
      const insideZone = distance <= zoneRadius;

      // Update map position if it exists
      // if (map) {
      //   map.panTo(newPos);
      // }

      // Update live position data
      setLivePosition({
        ...newPos,
        isInZone: insideZone,
        distance,
      });

      // Check zone status changes
      if (insideZone !== isInZone) {
        setIsInZone(insideZone);

        if (insideZone && !isClockIn) {
          setIsClockIn(true);
          socket.emit('check-in', { userId: user._id, date: new Date() })

          socket.on("check-in-success", (data) => {
            if (data) {
              console.log(data)
              if (data.result.message === "Check-in successful") {
                setClockInTime(new Date(data.result.data.checkin_time));
              } else {
                setClockInTime(new Date(data.result.attendance.checkin_time));
              }
            }
          })
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
          timeout: 10000, // Longer timeout
          maximumAge: 0, // Always get fresh position
          distanceFilter: 0, // Get updates even if position hasn't changed much
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
    setLivePosition,
    isInZone,
    setIsInZone,
    isClockIn,
    setIsClockIn,
    setClockInTime,
    setClockOutTime,
    setUserHeading,
    lastUpdateTime,
  ]);

  if (loadError) return <div className="p-4 text-red-600">Error loading map</div>;
  if (!isLoaded) return <div className="p-4">Loading map...</div>;

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
        // center={history}
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
            {!positionValid && <span className="text-yellow-600"> • Low accuracy</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(GPSMap);