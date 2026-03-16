import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types';
import { MapPin, Navigation, Loader2, Bookmark, Plus, X, Home, Briefcase, Dumbbell, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

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

const EMOJI_OPTIONS = [
  { emoji: '🏠', label: 'Home', icon: <Home size={16} /> },
  { emoji: '🏢', label: 'Office', icon: <Briefcase size={16} /> },
  { emoji: '💪', label: 'Gym', icon: <Dumbbell size={16} /> },
  { emoji: '☕', label: 'Cafe', icon: <Coffee size={16} /> },
];

interface MapPickerProps {
  location: Location | null;
  onLocationSelect: (location: Location) => void;
  className?: string;
}

export default function MapPicker({ location, onLocationSelect, className = '' }: MapPickerProps) {
  const { savedAddresses, setSavedAddresses, addNotification } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [saveEmoji, setSaveEmoji] = useState('🏠');
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

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onLocationSelect({ lat: 0, lng: 0, address: manualAddress });
      setShowManual(false);
    }
  };

  const handleSavedAddressClick = (addr: typeof savedAddresses[0]) => {
    onLocationSelect(addr.location);
    addNotification('Address Selected', `Using saved address: ${addr.label}`, 'info');
  };

  const handleSaveAddress = () => {
    if (!location || !saveLabel.trim()) return;
    setSavedAddresses([
      ...savedAddresses,
      {
        id: `addr-${Date.now()}`,
        label: saveLabel.trim(),
        emoji: saveEmoji,
        location,
      },
    ]);
    addNotification('Address Saved', `"${saveLabel}" has been saved to your address book.`, 'success');
    setShowSaveDialog(false);
    setSaveLabel('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Saved Address Chips (Feature 4) */}
      {savedAddresses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {savedAddresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => handleSavedAddressClick(addr)}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-sm border-2 text-sm font-heading font-bold uppercase tracking-wider transition-all ${
                location?.address === addr.location.address
                  ? 'border-primary bg-primary/10 text-primary shadow-brutal-sm'
                  : 'border-border bg-bg text-text hover:border-primary'
              }`}
            >
              <span>{addr.emoji}</span>
              <span>{addr.label}</span>
            </button>
          ))}
        </div>
      )}

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

      {/* Save Address Dialog (Feature 4) */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-surface border-2 border-primary rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-text text-sm uppercase tracking-wider">Save Address</h4>
                <button onClick={() => setShowSaveDialog(false)} className="text-muted hover:text-text transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                {EMOJI_OPTIONS.map((opt) => (
                  <button
                    key={opt.emoji}
                    onClick={() => { setSaveEmoji(opt.emoji); setSaveLabel(opt.label); }}
                    className={`flex-1 py-2 text-center rounded-sm border-2 transition-all ${
                      saveEmoji === opt.emoji
                        ? 'border-primary bg-primary/10 shadow-brutal-sm'
                        : 'border-border bg-bg hover:border-muted'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <p className="text-[10px] text-muted font-heading font-bold uppercase mt-1">{opt.label}</p>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder="Address label (e.g., Home)"
                className="input-brutal text-sm"
              />
              <button onClick={handleSaveAddress} disabled={!saveLabel.trim()} className="btn-primary w-full py-2 text-sm disabled:opacity-50">
                <Bookmark size={14} className="mr-2" /> Save Address
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
