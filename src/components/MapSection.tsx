'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
};

type LatLng = { lat: number; lng: number };

type Detail = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  service_category?: { icon_url?: string };
  place_category?: { icon_url?: string };
};

type Props = {
  origin: LatLng;
  details: Detail[];
  selectedDetail: Detail | null;
  onDetailSelect: (detail: Detail) => void;
  onVisibleIdsChange: (ids: Set<string>) => void;
};

const CIRCLE_RADIUS_PX = 250;
const DALLAS_CENTER: LatLng = { lat: 32.7767, lng: -96.7970 };

const MapSection = ({ origin, details, selectedDetail, onDetailSelect, onVisibleIdsChange }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBshs3gL-QjlozjuEJDLnsR3Qc4PNE9RVg',
    libraries: ['places', 'geometry'],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [userPosition, setUserPosition] = useState<LatLng>(origin);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [circleDiameterKm, setCircleDiameterKm] = useState<number>(0);

  const spokenSteps = useRef<Set<number>>(new Set());
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn('Failed to track position:', err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (!isLoaded || !selectedDetail || !selectedDetail.latitude || !selectedDetail.longitude) {
      setDirections(null);
      setSteps([]);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userPosition,
        destination: {
          lat: selectedDetail.latitude,
          lng: selectedDetail.longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
          setSteps(result.routes[0].legs[0].steps);
          spokenSteps.current.clear();
        } else {
          console.error('Failed to fetch directions:', status);
        }
      }
    );
  }, [isLoaded, selectedDetail, userPosition]);

  const detectVisibleMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const overlay = new window.google.maps.OverlayView();
    overlay.onAdd = () => {};
    overlay.draw = () => {
      const projection = overlay.getProjection();
      if (!projection) return;

      const idsInCircle = new Set<string>();
      const bounds = mapRef.current!.getDiv().getBoundingClientRect();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // --- Calculate circle diameter in real-world distance ---
      const centerLatLng = mapRef.current!.getCenter()!;
      const pointEast = projection.fromContainerPixelToLatLng(
        new google.maps.Point(centerX + CIRCLE_RADIUS_PX, centerY)
      );
      const pointWest = projection.fromContainerPixelToLatLng(
        new google.maps.Point(centerX - CIRCLE_RADIUS_PX, centerY)
      );

      if (pointEast && pointWest && google.maps.geometry?.spherical) {
        const diameterMeters = google.maps.geometry.spherical.computeDistanceBetween(pointEast, pointWest);
        setCircleDiameterKm(diameterMeters / 1000);
      }

      details.forEach((d) => {
        if (!d.latitude || !d.longitude) return;
        const latLng = new google.maps.LatLng(d.latitude, d.longitude);
        const pixel = projection.fromLatLngToContainerPixel(latLng);
        if (!pixel) return;

        const dx = pixel.x - centerX;
        const dy = pixel.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= CIRCLE_RADIUS_PX) {
          idsInCircle.add(d.id);
        }
      });

      setVisibleIds(idsInCircle);
      onVisibleIdsChange(idsInCircle);
    };

    overlay.setMap(mapRef.current);
  }, [details, onVisibleIdsChange]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-full w-full relative">
      {/* Circle size label */}
      <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0099E8',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 20,
        }}
      >
        Diameter: {circleDiameterKm.toFixed(2)} km
      </div>

      {/* Dashed circle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${CIRCLE_RADIUS_PX * 2}px`,
          height: `${CIRCLE_RADIUS_PX * 2}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '8px dashed #0099E8',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DALLAS_CENTER}
        zoom={11}
        onLoad={(map) => {
          mapRef.current = map;
          setTimeout(() => detectVisibleMarkers(), 500);
        }}
        onIdle={detectVisibleMarkers}
      >
        <Marker
          position={userPosition}
          label="You"
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />

        {details.filter((d) => visibleIds.has(d.id)).map((d) => (
          <OverlayView
            key={d.id}
            position={{ lat: d.latitude!, lng: d.longitude! }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              onClick={() => onDetailSelect(d)}
              className="flex flex-col items-center group cursor-pointer transform -translate-x-1/2 -translate-y-full transition-opacity duration-300"
            >
              <img
                src={
                  d.service_category?.icon_url ||
                  d.place_category?.icon_url ||
                  'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                }
                className="w-12 h-12 rounded-xl p-1 border-5 border-[#52C4FF] shadow-md object-contain bg-white border-double"
                alt={d.name}
              />
              <div className="mt-1 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                {d.name}
              </div>
            </div>
          </OverlayView>
        ))}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default MapSection;
