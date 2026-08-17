import React, { useState, useEffect } from 'react';
import { RoleSelectorLandingView } from './views/RoleSelectorLandingView';
import { KdaksDashboardView } from '../../SIMPUL/FE/src/views/KdaksDashboardView';
import { LoraTaskView } from '../../LORA/src/views/LoraTaskView';
import { PublicMapView } from './views/PublicMapView';
import { RefreshCw } from 'lucide-react';

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
    <div className="relative min-h-screen bg-[hsl(230,25%,8%)] text-gray-100 font-sans selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* M3 Floating Extended FAB Switch Role Button */}
      {currentPath !== '/' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSwitchRole}
            className="flex items-center gap-2.5 rounded-full bg-[hsl(172,85%,45%)] px-5 py-3 text-xs font-black text-gray-950 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[hsl(172,90%,50%)] hover:shadow-[hsl(172,85%,45%,0.3)] active:scale-95 border border-white/20"
          >
            <RefreshCw className="w-4 h-4 text-gray-950" />
            <span>Switch Role (Ganti Aplikasi)</span>
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
