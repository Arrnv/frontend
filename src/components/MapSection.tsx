'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  GoogleMap,
  Marker,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api';
import { MarkerClusterer } from "@googlemaps/markerclusterer";


const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  zIndex: 0 ,
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
  selectedCity?: string;
  vibeCityCoords?: LatLng | null;  // ⭐ ADD THIS
};



const DALLAS_CENTER: LatLng = { lat: 32.7767, lng: -96.7970 };

const MapSection = ({ origin, details, onDetailSelect, onVisibleIdsChange,vibeCityCoords }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry'],
  });
const [mapZoom, setMapZoom] = useState(11);

  const [userPosition, setUserPosition] = useState<LatLng>(origin);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [circleDiameterKm, setCircleDiameterKm] = useState<number>(0);
  const [circleRadiusPx, setCircleRadiusPx] = useState<number>(250);

  const mapRef = useRef<google.maps.Map | null>(null);
const clustererRef = useRef<MarkerClusterer | null>(null);
const markerScale = (() => {
  if (mapZoom >= 14) return 1;
  if (mapZoom <= 9) return 0.7;
  return 0.7 + ((mapZoom - 9) / 5) * 0.3; // smooth interpolation
})();

  // Adjust circle size for mobile
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 768) {
        setCircleRadiusPx(180);
      } else {
        setCircleRadiusPx(250);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  
  // Track user position
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  

  // Detect visible markers
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

      const pointEast = projection.fromContainerPixelToLatLng(
        new google.maps.Point(centerX + circleRadiusPx, centerY)
      );
      const pointWest = projection.fromContainerPixelToLatLng(
        new google.maps.Point(centerX - circleRadiusPx, centerY)
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

        if (distance <= circleRadiusPx) {
          idsInCircle.add(d.id);
        }
      });

      setVisibleIds(idsInCircle);
      onVisibleIdsChange(idsInCircle);
    };

    overlay.setMap(mapRef.current);
  }, [details, onVisibleIdsChange, circleRadiusPx]);
  // ⭐ Smooth Pan when searched city changes
useEffect(() => {
  if (mapRef.current && vibeCityCoords) {
    mapRef.current.panTo(vibeCityCoords); // smooth movement
    mapRef.current.setZoom(12);
  }
}, [vibeCityCoords]);


  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-full w-full relative">
      {/* Circle size label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0099E8] text-white px-3 py-1 rounded-md text-sm z-20">
        Diameter: {circleDiameterKm.toFixed(2)} km
      </div>

<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${circleRadiusPx * 2}px`,
    height: `${circleRadiusPx * 2}px`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 8,

    /* Premium combo */
    background: `
      radial-gradient(
        circle,
        rgba(37, 99, 235, 0.10) 0%,
        rgba(37, 99, 235, 0.06) 55%,
        rgba(37, 99, 235, 0.03) 70%,
        transparent 74%
      )
    `,
    boxShadow: `
      0 0 0 1.5px rgba(37, 99, 235, 0.35),
      0 0 40px rgba(37, 99, 235, 0.25)
    `,
  }}
/>



<GoogleMap
  mapContainerStyle={containerStyle}
  center={vibeCityCoords || origin}
  zoom={11}
  onZoomChanged={() => {
    if (mapRef.current) {
      setMapZoom(mapRef.current.getZoom() || 11);
    }
  }}
  onLoad={(map) => {
    mapRef.current = map;
    setMapZoom(map.getZoom() || 11);
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
  style={{
    transform: `translate(-50%, -100%) scale(${markerScale})`,
    transformOrigin: 'bottom center',
  }}
  className="
    relative
    flex flex-col items-center
    cursor-pointer
    group
    transition-transform duration-200
  "
>




  {/* Blue ring */}
  <div
    className="
      w-13 h-13
      rounded-2xl
      bg-[#0099E8]
      flex items-center justify-center
      shadow-[0_10px_30px_rgba(37,99,235,0.35)]
    "
  >
    {/* White card */}
    <div
      className="
        w-11 h-11
        rounded-xl
        bg-white
        ring-1 ring-black/10
        flex items-center justify-center
      "
    >
      <img
        src={
          d.service_category?.icon_url ||
          d.place_category?.icon_url
        }
        className="w-6 h-6 object-contain"
      />
    </div>
  </div>

  {/* Stem */}
  <div className="w-[2px] h-3 bg-blue-600/40 rounded-full mt-[-2px]" />

  {/* Label */}
{mapZoom >= 12 && (
  <div
    className="
      mt-1
      px-2 py-0.5
      text-xs
      rounded-md
      bg-black/75
      text-white
      opacity-0
      group-hover:opacity-100
      transition
      whitespace-nowrap
    "
  >
    {d.name}
  </div>
)}

</div>


          </OverlayView>
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapSection;
