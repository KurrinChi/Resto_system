import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Button } from '../common/Button';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
export const MapPicker = ({ onConfirm }) => {
    const [query, setQuery] = React.useState('');
    const [center, setCenter] = React.useState({ lat: 14.5995, lon: 120.9842, zoom: 13 });
    const [results, setResults] = React.useState([]);
    const [loadingGeo, setLoadingGeo] = React.useState(false);
    const [confirming, setConfirming] = React.useState(false);
    const search = async () => {
        if (!query)
            return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
            if (data && data[0]) {
                setCenter({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), zoom: 14 });
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const onSelect = (r) => {
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
        navigator.geolocation.getCurrentPosition((pos) => {
            setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude, zoom: 16 });
            setLoadingGeo(false);
        }, (err) => {
            console.error('Geolocation error', err);
            alert('Unable to retrieve your location. Please allow location access or try searching.');
            setLoadingGeo(false);
        }, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
    };
    const bbox = (lat, lon, delta = 0.02) => `${lon - delta}%2C${lat - delta}%2C${lon + delta}%2C${lat + delta}`;
    const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox(center.lat, center.lon)}&layer=mapnik&marker=${center.lat}%2C${center.lon}`;
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { style: { height: 360, borderRadius: 12, overflow: 'hidden', background: THEME.colors.background.primary }, children: _jsx("iframe", { title: "map", src: iframeSrc, style: { width: '100%', height: '100%', border: 0 } }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Enter address or search location", className: "w-full px-3 py-2 rounded-md bg-white border", style: { borderColor: THEME.colors.border.DEFAULT } }), _jsx("div", { className: "absolute left-0 right-0 mt-12 bg-white rounded-md shadow-md max-h-48 overflow-auto", children: results.map((r, i) => (_jsx("button", { onClick: () => onSelect(r), className: "w-full text-left px-3 py-2 hover:bg-gray-100", children: r.display_name }, i))) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { disabled: loadingGeo, onClick: useMyLocation, className: "px-4 py-2 rounded-md", style: { background: THEME.colors.primary.DEFAULT, color: '#fff' }, children: loadingGeo ? 'Locating...' : 'Use my location' }), _jsx("button", { onClick: search, className: "px-4 py-2 rounded-md", style: { background: THEME.colors.primary.light, color: '#fff' }, children: "Search" }), _jsx(Button, { onClick: async () => {
                                    setConfirming(true);
                                    try {
                                        // Reverse geocode to get a readable address
                                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lon}`);
                                        const data = await res.json();
                                        const display = data?.display_name;
                                        onConfirm?.({ ...center, display_name: display });
                                    }
                                    catch (e) {
                                        console.error('Reverse geocode failed', e);
                                        onConfirm?.(center);
                                    }
                                    finally {
                                        setConfirming(false);
                                    }
                                }, children: confirming ? 'Confirming...' : 'Confirm location' })] })] })] }));
};
export default MapPicker;
