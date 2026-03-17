import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';
import { MapPin, Navigation, Loader2, Bookmark } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SavedAddressChips from './SavedAddressChips';
import SaveAddressDialog from './SaveAddressDialog';
import ManualAddressEntry from './ManualAddressEntry';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
  const { savedAddresses, addNotification } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const defaultCenter: [number, number] = [12.9716, 77.5946]; // Bangalore
  const center: [number, number] = location ? [location.lat, location.lng] : defaultCenter;

  useEffect(() => {
    const handleOff = () => setIsOffline(true);
    const handleOn = () => setIsOffline(false);
    window.addEventListener('offline', handleOff);
    window.addEventListener('online', handleOn);
    return () => {
      window.removeEventListener('offline', handleOff);
      window.removeEventListener('online', handleOn);
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    if (isOffline) {
      onLocationSelect({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)} (offline)` });
      addNotification('Offline Mode', 'Address lookup unavailable offline. Coordinates saved.', 'warning');
      return;
    }
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
      if (!navigator.onLine) {
        addNotification('Offline', 'Map lookup failed — you appear to be offline.', 'warning');
      }
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

  const handleManualSubmit = (address: string) => {
    onLocationSelect({ lat: 0, lng: 0, address });
    setShowManual(false);
  };

  const handleSavedAddressClick = (addr: any) => {
    onLocationSelect(addr.location);
    addNotification('Address Selected', `Using saved address: ${addr.label}`, 'info');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Saved Address Chips */}
      <SavedAddressChips
        savedAddresses={savedAddresses}
        currentLocation={location}
        onSelect={handleSavedAddressClick}
      />

      <div className="relative rounded-sm overflow-hidden border-2 border-border" style={{ height: 200 }}>
        {isOffline ? (
          <div className="w-full h-full bg-bg flex flex-col items-center justify-center">
            <MapPin size={32} className="text-muted mb-2" />
            <p className="text-sm text-muted font-body text-center px-4">Map unavailable offline</p>
            <p className="text-xs text-muted font-body mt-1">Use a saved address or enter manually</p>
          </div>
        ) : (
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
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-bg/60 flex items-center justify-center z-1000">
            <Loader2 size={28} className="text-primary animate-spin" />
          </div>
        )}
      </div>

      {location && (
        <div className="flex items-start space-x-3 bg-bg border-2 border-border p-3 rounded-sm transition-colors">
          <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-text font-body line-clamp-2 flex-1">{location.address}</p>
          {/* Save Address Button */}
          <button
            onClick={() => setShowSaveDialog(true)}
            className="shrink-0 w-8 h-8 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary hover:bg-bg transition-colors"
            title="Save this address"
          >
            <Bookmark size={14} />
          </button>
        </div>
      )}

      {/* Save Address Dialog */}
      <SaveAddressDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        location={location}
      />

      {showManual ? (
        <ManualAddressEntry
          onSubmit={handleManualSubmit}
          onCancel={() => setShowManual(false)}
        />
      ) : (
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
