import React from 'react';
import { Button } from '../common/Button';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';

type Center = { lat: number; lon: number; zoom?: number };

export const MapPicker: React.FC<{ onConfirm?: (c: Center & { display_name?: string }) => void }> = ({ onConfirm }) => {
  const [query, setQuery] = React.useState('');
  const [center, setCenter] = React.useState<Center>({ lat: 14.5995, lon: 120.9842, zoom: 13 });
  const [results, setResults] = React.useState<any[]>([]);
  const [loadingGeo, setLoadingGeo] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  const search = async () => {
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      if (data && data[0]) {
        setCenter({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), zoom: 14 });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSelect = (r: any) => {
    setCenter({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), zoom: 14 });
    setResults([]);
    setQuery(r.display_name);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude, zoom: 16 });
        setLoadingGeo(false);
      },
      (err) => {
        console.error('Geolocation error', err);
        alert('Unable to retrieve your location. Please allow location access or try searching.');
        setLoadingGeo(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const bbox = (lat: number, lon: number, delta = 0.02) => `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(center.lat, center.lon)}&layer=mapnik&marker=${center.lat}%2C${center.lon}`;

  return (
    <div className="space-y-4">
      <div style={{ height: 360, borderRadius: 12, overflow: 'hidden', background: THEME.colors.background.primary }}>
        <iframe
          title="map"
          src={iframeSrc}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter address or search location" className="w-full px-3 py-2 rounded-md bg-white border" style={{ borderColor: THEME.colors.border.DEFAULT }} />
          <div className="absolute left-0 right-0 mt-12 bg-white rounded-md shadow-md max-h-48 overflow-auto">
            {results.map((r, i) => (
              <button key={i} onClick={() => onSelect(r)} className="w-full text-left px-3 py-2 hover:bg-gray-100">
                {r.display_name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button disabled={loadingGeo} onClick={useMyLocation} className="px-4 py-2 rounded-md" style={{ background: THEME.colors.primary.DEFAULT, color: '#fff' }}>
              {loadingGeo ? 'Locating...' : 'Use my location'}
            </button>
            <button onClick={search} className="px-4 py-2 rounded-md" style={{ background: THEME.colors.primary.light, color: '#fff' }}>Search</button>
            <Button onClick={async () => {
              setConfirming(true);
              try {
                // Reverse geocode to get a readable address
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lon}`);
                const data = await res.json();
                const display = data?.display_name;
                onConfirm?.({ ...center, display_name: display });
              } catch (e) {
                console.error('Reverse geocode failed', e);
                onConfirm?.(center);
              } finally {
                setConfirming(false);
              }
            }}>
              {confirming ? 'Confirming...' : 'Confirm location'}
            </Button>
          </div>
      </div>
    </div>
  );
};

export default MapPicker;
