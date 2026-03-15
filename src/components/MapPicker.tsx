import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix Leaflet default marker icon issue
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function DraggableMarker({ position, onDragEnd }: { position: [number, number]; onDragEnd: (lat: number, lng: number) => void }) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onDragEnd(e.latlng.lat, e.latlng.lng);
    }
  });

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (marker) {
            const latlng = marker.getLatLng();
            onDragEnd(latlng.lat, latlng.lng);
          }
        },
      }}
    />
  );
}

interface MapPickerProps {
  location: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export default function MapPicker({ location, onLocationSelect, className = '' }: MapPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore
  const center: [number, number] = location ? [location.lat, location.lng] : defaultCenter;

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      onLocationSelect({ lat, lng, address });
    } catch {
      onLocationSelect({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
        () => {
          setIsLoading(false);
          setShowManual(true);
        }
      );
    } else {
      setShowManual(true);
    }
  };

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onLocationSelect({ lat: 0, lng: 0, address: manualAddress });
      setShowManual(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative rounded-sm overflow-hidden border-2 border-border" style={{ height: 200 }}>
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <DraggableMarker
            position={center}
            onDragEnd={(lat, lng) => reverseGeocode(lat, lng)}
          />
        </MapContainer>

        {isLoading && (
          <div className="absolute inset-0 bg-bg/60 flex items-center justify-center z-[1000]">
            <Loader2 size={28} className="text-primary animate-spin" />
          </div>
        )}
      </div>

      {location && (
        <div className="flex items-start space-x-3 bg-bg border-2 border-border p-3 rounded-sm transition-colors">
          <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-text font-body line-clamp-2 flex-1">{location.address}</p>
        </div>
      )}

      {showManual && (
        <div>
          <textarea
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Enter complete delivery address..."
            className="input-brutal resize-none h-20 mb-2"
          />
          <div className="flex space-x-2">
            <button onClick={handleManualSubmit} className="btn-primary flex-1 py-2 text-sm">
              Confirm Address
            </button>
            <button onClick={() => setShowManual(false)} className="btn-secondary flex-1 py-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showManual && (
        <div className="flex space-x-3">
          <button
            onClick={handleDetectGPS}
            className="flex-1 py-2.5 px-4 bg-primary text-bg border-2 border-border rounded-sm font-heading font-bold text-sm flex items-center justify-center uppercase tracking-wider hover:bg-opacity-90 transition-colors shadow-brutal-sm"
          >
            <Navigation size={16} className="mr-2" /> Detect GPS
          </button>
          <button
            onClick={() => setShowManual(true)}
            className="flex-1 py-2.5 px-4 bg-surface text-text border-2 border-border rounded-sm font-heading font-bold text-sm uppercase tracking-wider hover:bg-bg transition-colors"
          >
            Enter Manually
          </button>
        </div>
      )}
    </div>
  );
}
