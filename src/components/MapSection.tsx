'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
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
};

const MapSection = ({ origin, details, selectedDetail }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry'],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [userPosition, setUserPosition] = useState<LatLng>(origin);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
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
          setCurrentStepIndex(0);
          spokenSteps.current.clear();
        } else {
          console.error('Failed to fetch directions:', status);
        }
      }
    );
  }, [isLoaded, selectedDetail, userPosition]);

  useEffect(() => {
    if (!steps.length) return;

    const step = steps[currentStepIndex];
    const userLatLng = new google.maps.LatLng(userPosition.lat, userPosition.lng);
    const stepEndLatLng = step?.end_location;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, stepEndLatLng);

    if (distance < 100 && !spokenSteps.current.has(currentStepIndex)) {
      speak(stripHtml(step.instructions));
      spokenSteps.current.add(currentStepIndex);
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }
  }, [userPosition, currentStepIndex, steps]);

  const speak = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
  };

  const stripHtml = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  useEffect(() => {
    if (!mapRef.current || !details.length || selectedDetail) return;

    const bounds = new google.maps.LatLngBounds();
    details.forEach((d) => {
      if (d.latitude && d.longitude) {
        bounds.extend({ lat: d.latitude, lng: d.longitude });
      }
    });
    bounds.extend(origin);
    mapRef.current.fitBounds(bounds);
  }, [mapRef, details, origin, selectedDetail]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPosition}
        zoom={15}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker
          position={userPosition}
          label="You"
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />

        {!selectedDetail &&
          details.map(
            (d) =>
              d.latitude &&
              d.longitude && (
                <OverlayView
                  key={d.id}
                  position={{ lat: d.latitude, lng: d.longitude }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className="flex flex-col items-center group cursor-pointer transform -translate-x-1/2 -translate-y-full">
                    <img
                      src={
                        d.service_category?.icon_url ||
                        d.place_category?.icon_url ||
                        'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      }
                      className="w-10 h-10 rounded-full border-2 border-black shadow-md object-contain bg-white"
                      alt={d.name}
                    />
                    <div className="mt-1 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      {d.name}
                    </div>
                  </div>
                </OverlayView>
              )
          )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default MapSection;
