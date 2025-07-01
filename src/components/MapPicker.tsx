'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

type LatLng = { lat: number; lng: number };

type Props = {
  selectedPosition: LatLng | null;
  onSelect: (lat: number, lng: number) => void;
};

// Fix for default marker icons not loading correctly
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({
  onSelect,
  selectedPosition,
}: {
  onSelect: (lat: number, lng: number) => void;
  selectedPosition: LatLng | null;
}) => {
  const [position, setPosition] = useState<LatLng>(selectedPosition || { lat: 20.5937, lng: 78.9629 });

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onSelect(lat, lng);
    },
  });

  // Sync external selectedPosition to local state
  useEffect(() => {
    if (selectedPosition) setPosition(selectedPosition);
  }, [selectedPosition]);

  return <Marker position={position} />;
};

const MapPicker = ({ selectedPosition, onSelect }: Props) => {
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={selectedPosition || { lat: 20.5937, lng: 78.9629 }}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onSelect} selectedPosition={selectedPosition} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
