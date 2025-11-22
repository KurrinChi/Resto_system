import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// NOTE: don't statically import leaflet-routing-machine here — it bundles its own Leaflet
// and can cause runtime conflicts. We'll dynamically import it at runtime so it attaches
// to the same `L` instance.
// Inject CSS to override routing control text colors to black
const routingStyleOverride = `
  .leaflet-routing-container {
    color: #000000 !important;
    background-color: white !important;
  }
  .leaflet-routing-container * {
    color: #000000 !important;
  }
  .leaflet-routing-alt {
    color: #000000 !important;
  }
  .leaflet-routing-alt table {
    color: #000000 !important;
  }
  .leaflet-routing-alt td,
  .leaflet-routing-alt th {
    color: #000000 !important;
  }
`;
// Inject style on module load
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = routingStyleOverride;
    document.head.appendChild(styleEl);
}
// Philippines geographic bounding box (approximate)
const PH_BOUNDS = L.latLngBounds(L.latLng(4.215806, 116.928055), // Southwest
L.latLng(21.32178, 126.599444) // Northeast
);
export const SearchBar = ({ onSelectResult, onNoResults }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef(null);
    const [dropdownPos, setDropdownPos] = useState(null);
    const handleSearchAddress = async () => {
        if (!searchQuery.trim())
            return;
        setSearching(true);
        try {
            // Restrict search to Philippines using countrycodes + viewbox + bounded
            const viewbox = '116.928055,21.32178,126.599444,4.215806'; // left,top,right,bottom (matches PH_BOUNDS corners)
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1&countrycodes=ph&viewbox=${viewbox}&bounded=1`;
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data);
            // Trigger callback if no results found
            if (data.length === 0 && onNoResults) {
                onNoResults();
            }
        }
        catch (error) {
            console.error('Search failed:', error);
            alert('Failed to search address. Please try again.');
        }
        finally {
            setSearching(false);
        }
    };
    const handleSelect = (result) => {
        setSearchResults([]);
        setSearchQuery(result.display_name);
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        const selected = L.latLng(lat, lon);
        // Validate selection lies within Philippines bounds
        if (!PH_BOUNDS.contains(selected)) {
            alert('Selected location is outside the Philippines bounds.');
            return;
        }
        onSelectResult(result);
    };
    // Compute and update dropdown position based on input's viewport position
    useEffect(() => {
        const updatePos = () => {
            if (!inputRef.current)
                return;
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPos({ left: rect.left, top: rect.bottom, width: rect.width });
        };
        // update when results open
        if (searchResults.length > 0) {
            updatePos();
            window.addEventListener('scroll', updatePos, true);
            window.addEventListener('resize', updatePos);
        }
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [searchResults.length]);
    return (_jsxs("div", { className: "relative z-[100]", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", ref: inputRef, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleSearchAddress(), placeholder: "Search address or location...", className: "flex-1 px-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#2b211f] text-white placeholder-gray-400 border border-gray-600" }), _jsx("button", { onClick: handleSearchAddress, disabled: searching || !searchQuery.trim(), className: "px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap", children: searching ? 'Searching...' : 'Search' })] }), searchResults.length > 0 && dropdownPos && createPortal(_jsx("div", { className: "border rounded-lg shadow-2xl max-h-60 overflow-y-auto bg-[#2b211f] border-gray-600", style: { position: 'fixed', left: dropdownPos.left, top: dropdownPos.top + 4, width: dropdownPos.width, zIndex: 100000 }, children: searchResults.map((result, index) => (_jsxs("button", { onClick: () => handleSelect(result), className: "w-full text-left px-4 py-3 hover:bg-[#3a2c29] transition border-b border-gray-700 last:border-b-0", children: [_jsx("div", { className: "text-sm font-medium text-white", children: result.display_name }), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: [result.type, " \u00B7 ", parseFloat(result.lat).toFixed(4), ", ", parseFloat(result.lon).toFixed(4)] })] }, index))) }), document.body)] }));
};
const Map = forwardRef(({ lat = 14.871852789906772, lng = 120.79893918035896, zoom = 15, points = [], onLocationSelect, }, ref) => {
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);
    const userMarkerRef = useRef(null);
    const extraMarkersRef = useRef([]);
    const [addingMarker, setAddingMarker] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    // Initialize map
    useEffect(() => {
        if (mapRef.current)
            return;
        mapRef.current = L.map("osm-map", {
            zoomControl: false,
            attributionControl: false,
            maxBounds: PH_BOUNDS,
            maxBoundsViscosity: 1.0,
            minZoom: 5,
            worldCopyJump: false,
        }).setView([lat, lng], zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            noWrap: true,
            bounds: PH_BOUNDS,
        }).addTo(mapRef.current);
        // Render any additional points passed in props
        if (points && points.length) {
            extraMarkersRef.current = points.map((p) => L.marker([p.lat, p.lng], {
                icon: L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    iconSize: [28, 28],
                }),
            })
                .addTo(mapRef.current)
                .bindPopup(p.label || `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`));
        }
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, [lat, lng, zoom]);
    // Update extra points when `points` prop changes
    useEffect(() => {
        if (!mapRef.current)
            return;
        // clear existing extra markers
        extraMarkersRef.current.forEach((m) => m.remove());
        extraMarkersRef.current = [];
        const pts = points || [];
        extraMarkersRef.current = pts.map((p) => L.marker([p.lat, p.lng], {
            icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [28, 28],
            }),
        })
            .addTo(mapRef.current)
            .bindPopup(p.label || `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`));
    }, [points]);
    // Handle click to add marker (no routing)
    useEffect(() => {
        if (!mapRef.current)
            return;
        const map = mapRef.current;
        const handleClick = (e) => {
            if (!addingMarker)
                return;
            // Remove existing marker
            userMarkerRef.current?.remove();
            routingControlRef.current?.remove();
            const userLatLng = e.latlng;
            setSelectedLocation({ lat: userLatLng.lat, lng: userLatLng.lng });
            // Add marker at clicked location
            userMarkerRef.current = L.marker(userLatLng, {
                icon: L.icon({
                    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
                    iconSize: [32, 32],
                }),
            }).addTo(map);
            setAddingMarker(false);
        };
        map.on("click", handleClick);
        return () => {
            map.off("click", handleClick);
        };
    }, [addingMarker, lat, lng]);
    const handleAddMarker = () => setAddingMarker(true);
    const handleClearMarker = () => {
        userMarkerRef.current?.remove();
        routingControlRef.current?.remove();
        setAddingMarker(false);
        setSelectedLocation(null);
    };
    // Update map cursor when adding marker mode changes
    useEffect(() => {
        if (!mapRef.current)
            return;
        const container = mapRef.current.getContainer();
        if (addingMarker) {
            container.style.cursor = 'crosshair';
        }
        else {
            container.style.cursor = '';
        }
    }, [addingMarker]);
    const handleSelectSearchResult = (result) => {
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);
        const newLatLng = L.latLng(newLat, newLng);
        if (!mapRef.current)
            return;
        // Guard: ensure selected location lies within Philippines bounds
        if (!PH_BOUNDS.contains(newLatLng)) {
            alert('Selected location is outside the Philippines bounds.');
            return;
        }
        // Remove existing user marker and routing
        userMarkerRef.current?.remove();
        routingControlRef.current?.remove();
        // Set selected location
        setSelectedLocation({ lat: newLat, lng: newLng });
        // Add marker at searched location
        userMarkerRef.current = L.marker([newLat, newLng], {
            icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
                iconSize: [32, 32],
            }),
        }).addTo(mapRef.current);
        // Pan map to location
        mapRef.current.setView([newLat, newLng], 16);
    };
    // Expose method to parent component
    useImperativeHandle(ref, () => ({
        handleSelectSearchResult,
    }));
    const handleConfirmLocation = async () => {
        if (!selectedLocation) {
            alert('Please select a location by clicking "Add Marker" and then clicking on the map');
            return;
        }
        try {
            // Reverse geocode to get address
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`);
            const data = await response.json();
            const address = data.display_name || `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`;
            // Store in localStorage
            localStorage.setItem('userAddress', address);
            localStorage.setItem('userLocation', JSON.stringify(selectedLocation));
            // Update user's address in backend if logged in
            try {
                const userRaw = sessionStorage.getItem('rs_current_user') || localStorage.getItem('rs_current_user');
                if (userRaw) {
                    const currentUser = JSON.parse(userRaw);
                    // Update backend
                    const updateResponse = await fetch(`http://localhost:8000/api/auth/update-address/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            address: address
                        })
                    });
                    if (updateResponse.ok) {
                        // Update local session storage with new address
                        currentUser.address = address;
                        sessionStorage.setItem('rs_current_user', JSON.stringify(currentUser));
                        localStorage.setItem('rs_current_user', JSON.stringify(currentUser));
                    }
                }
            }
            catch (err) {
                console.warn('Failed to update user address in backend:', err);
            }
            // Notify parent and other components
            onLocationSelect?.();
        }
        catch (error) {
            console.error('Failed to get address:', error);
            const fallbackAddress = `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`;
            localStorage.setItem('userAddress', fallbackAddress);
            localStorage.setItem('userLocation', JSON.stringify(selectedLocation));
            onLocationSelect?.();
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { id: "osm-map", className: "w-full rounded-xl shadow-lg border border-gray-300", style: { height: "60vh" } }), _jsxs("div", { className: "flex flex-wrap gap-2 justify-center items-center pt-2 border-t border-gray-200", children: [["Add Marker", "Clear Marker"].map((label, i) => {
                        const handler = i === 0 ? handleAddMarker : handleClearMarker;
                        return (_jsx("button", { onClick: handler, className: "px-3 py-1.5 text-sm bg-[#212121] text-white rounded-lg shadow hover:bg-gray-800 transition", children: label }, i));
                    }), _jsx("button", { onClick: handleConfirmLocation, disabled: !selectedLocation, className: "px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold", children: "Confirm Location" })] })] }));
});
Map.displayName = 'Map';
export default Map;
