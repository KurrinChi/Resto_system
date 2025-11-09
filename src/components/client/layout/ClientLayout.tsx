import React from 'react';
import { Outlet } from 'react-router-dom';
import { ClientSidebar } from '../ClientSidebar';
import { ClientHeader } from './ClientHeader';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Modal } from '../../common/Modal';
import Map, { SearchBar } from '../embed/MapClean';
import '../client.css';

interface ClientLayoutProps {
  children?: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [mapOpen, setMapOpen] = React.useState(false);
  const mapRef = React.useRef<any>(null);

  const handleLocationSelect = () => {
    // Trigger event for header to refresh address
    window.dispatchEvent(new Event('addressUpdated'));
    setMapOpen(false);
  };

  const handleSearchResult = (result: any) => {
    if (mapRef.current) {
      mapRef.current.handleSelectSearchResult(result);
    }
  };

  // Listen for openMapModal event from header or other components
  React.useEffect(() => {
    const handleOpenMap = () => setMapOpen(true);
    window.addEventListener('openMapModal', handleOpenMap);
    return () => window.removeEventListener('openMapModal', handleOpenMap);
  }, []);

  return (
    <div className="client-area flex h-screen w-screen overflow-hidden" style={{ backgroundColor: THEME.colors.background.primary }}>
      <ClientSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ClientHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8" style={{ backgroundColor: THEME.colors.background.secondary }}>
          <div className="max-w-full">{children ?? <Outlet />}</div>
        </main>
      </div>

      {/* Global Map Modal - accessible from anywhere in client area */}
      <Modal 
        isOpen={mapOpen} 
        onClose={() => setMapOpen(false)} 
        title="Select your location" 
        maxWidth="xl"
        headerExtra={<SearchBar onSelectResult={handleSearchResult} />}
      >
        <div className="space-y-4 overflow-visible">
          <div className="rounded-lg">
            <Map ref={mapRef} onLocationSelect={handleLocationSelect} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientLayout;
