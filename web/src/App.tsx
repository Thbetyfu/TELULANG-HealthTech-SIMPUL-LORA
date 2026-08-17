import React, { useState, useEffect } from 'react';
import { RoleSelectorLandingView } from './views/RoleSelectorLandingView';
import { KdaksDashboardView } from '../../SIMPUL/FE/src/views/KdaksDashboardView';
import { LoraTaskView } from '../../LORA/src/views/LoraTaskView';
import { PublicMapView } from './views/PublicMapView';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');

  useEffect(() => {
    const savedRole = localStorage.getItem('simpul_lora_role');
    if (savedRole) {
      setCurrentPath(savedRole);
    }
  }, []);

  const handleSelectRole = (path: string) => {
    localStorage.setItem('simpul_lora_role', path);
    setCurrentPath(path);
  };

  const handleSwitchRole = () => {
    localStorage.removeItem('simpul_lora_role');
    setCurrentPath('/');
  };

  return (
    <div className="relative min-h-screen">
      {/* M3 Floating Switch Role Button on non-landing views */}
      {currentPath !== '/' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleSwitchRole}
            className="flex items-center gap-2 rounded-full bg-[hsl(174,100%,41%)] px-4 py-2.5 text-xs font-bold text-gray-950 shadow-2xl transition hover:scale-105"
          >
            <span>🔄 Switch Role (Ganti Aplikasi)</span>
          </button>
        </div>
      )}

      {currentPath === '/' && (
        <RoleSelectorLandingView onSelectRole={handleSelectRole} />
      )}
      {currentPath === '/simpul' && (
        <KdaksDashboardView />
      )}
      {currentPath === '/lora' && (
        <LoraTaskView />
      )}
      {currentPath === '/public' && (
        <PublicMapView />
      )}
    </div>
  );
};

export default App;
