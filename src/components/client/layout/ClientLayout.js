import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ClientSidebar } from '../ClientSidebar';
import { ClientHeader } from './ClientHeader';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Modal } from '../../common/Modal';
import Map, { SearchBar } from '../embed/MapClean';
import { Toast } from '../../common/Toast';
import '../client.css';
export const ClientLayout = ({ children }) => {
    const [mapOpen, setMapOpen] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState(null);
    const mapRef = React.useRef(null);
    const handleLocationSelect = () => {
        // Trigger event for header to refresh address
        window.dispatchEvent(new Event('addressUpdated'));
        setMapOpen(false);
    };
    const handleSearchResult = (result) => {
        if (mapRef.current) {
            mapRef.current.handleSelectSearchResult(result);
        }
    };
    const handleNoResults = () => {
        setToastMessage('No results found. Please try a different search term.');
    };
    // Listen for openMapModal event from header or other components
    React.useEffect(() => {
        const handleOpenMap = () => setMapOpen(true);
        window.addEventListener('openMapModal', handleOpenMap);
        return () => window.removeEventListener('openMapModal', handleOpenMap);
    }, []);
    return (_jsxs("div", { className: "client-area flex h-screen w-screen overflow-hidden", style: { backgroundColor: THEME.colors.background.primary }, children: [_jsx(ClientSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden min-w-0", children: [_jsx(ClientHeader, {}), _jsx("main", { className: "flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8", style: { backgroundColor: THEME.colors.background.secondary }, children: _jsx("div", { className: "max-w-full", children: children ?? _jsx(Outlet, {}) }) })] }), _jsx(Modal, { isOpen: mapOpen, onClose: () => setMapOpen(false), title: "Select your location", maxWidth: "xl", headerExtra: _jsx(SearchBar, { onSelectResult: handleSearchResult, onNoResults: handleNoResults }), children: _jsx("div", { className: "space-y-4 overflow-visible", children: _jsx("div", { className: "rounded-lg", children: _jsx(Map, { ref: mapRef, onLocationSelect: handleLocationSelect }) }) }) }), toastMessage && (_jsx(Toast, { message: toastMessage, onClose: () => setToastMessage(null) }))] }));
};
export default ClientLayout;
