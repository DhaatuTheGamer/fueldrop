import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import MapPicker from '../MapPicker';
import * as AppContextModule from '../../context/AppContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Need to mock leaflet to prevent errors in jsdom
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  useMapEvents: (handlers: any) => {
    // expose the click handler to window so we can trigger it in tests
    (window as any).__triggerMapClick = (lat: number, lng: number) => {
      if (handlers.click) handlers.click({ latlng: { lat, lng } });
    };
    return {};
  },
}));

// Mock framer-motion AnimatePresence
vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('MapPicker reverseGeocode error handling', () => {
  let mockOnLocationSelect: any;
  let mockAddNotification: any;

  beforeEach(() => {
    mockOnLocationSelect = vi.fn();
    mockAddNotification = vi.fn();
    global.fetch = vi.fn();

    // reset navigator.onLine mock
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

    // Mock useAppContext
    vi.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      savedAddresses: [],
      setSavedAddresses: vi.fn(),
      addNotification: mockAddNotification,
    } as any);
  });

  const renderComponent = () => {
    return render(
      <MapPicker location={null} onLocationSelect={mockOnLocationSelect} />
    );
  };

  it('calls onLocationSelect with fallback address when fetch rejects', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('API Down'));

    renderComponent();

    // Trigger the geocode via our mocked map click
    expect((window as any).__triggerMapClick).toBeDefined();

    act(() => {
      (window as any).__triggerMapClick(40.7128, -74.0060);
    });

    // Should call onLocationSelect with coordinate string
    await waitFor(() => {
      expect(mockOnLocationSelect).toHaveBeenCalledWith({
        lat: 40.7128,
        lng: -74.0060,
        address: '40.7128, -74.0060', // fallback address format
      });
    });

    // Should NOT show notification since navigator.onLine is true
    expect(mockAddNotification).not.toHaveBeenCalled();
  });

  it('calls onLocationSelect with fallback and notifies if offline during fetch rejection', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network disconnected'));

    renderComponent();

    // Set offline
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    act(() => {
      (window as any).__triggerMapClick(51.5074, -0.1278);
    });

    await waitFor(() => {
      expect(mockOnLocationSelect).toHaveBeenCalledWith({
        lat: 51.5074,
        lng: -0.1278,
        address: '51.5074, -0.1278', // fallback
      });
    });

    // Should show notification about being offline
    expect(mockAddNotification).toHaveBeenCalledWith(
      'Offline',
      'Map lookup failed — you appear to be offline.',
      'warning'
    );
  });
});
