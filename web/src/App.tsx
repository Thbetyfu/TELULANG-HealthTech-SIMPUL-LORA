import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { LoginView } from './views/LoginView';
import {
  clearSession,
  loadStoredSession,
  persistSession,
  type UserSession
} from './services/auth.service';
import { KdaksDashboardView } from '../../SIMPUL/FE/src/views/KdaksDashboardView';
import { LoraTaskView } from '../../LORA/src/views/LoraTaskView';
import { PublicMapView } from './views/PublicMapView';
import { LogOut } from 'lucide-react';
import { SimpulLoraUnifiedLogoSvg } from './components/Logos';
import { WebSocketAlertListener } from './components/WebSocketAlertListener';
import './styles/m3-tokens.css';

const ROLE_PATH: Record<UserSession['role'], string> = {
  simpul: '/simpul',
  lora: '/lora',
  public: '/public'
};

const pathToRole = (pathname: string): UserSession['role'] | null => {
  if (pathname.startsWith('/simpul')) return 'simpul';
  if (pathname.startsWith('/lora')) return 'lora';
  if (pathname.startsWith('/public')) return 'public';
  return null;
};

const AppShell: React.FC<{
  session: UserSession;
  onLogout: () => void;
  children: React.ReactNode;
}> = ({ session, onLogout, children }) => (
  <div
    className="min-h-screen font-sans"
    style={{
      background: 'var(--md-sys-color-surface)',
      color: 'var(--md-sys-color-on-surface)'
    }}
  >
    <WebSocketAlertListener />

    <header
      className="sticky top-0 z-50 border-b px-3 sm:px-8 py-2.5 sm:py-3 shadow-2xl"
      style={{
        background: 'var(--md-sys-color-surface-container-lowest)',
        borderColor: 'var(--md-sys-color-outline-variant)'
      }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <SimpulLoraUnifiedLogoSvg className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-bold tracking-wider truncate">simpul-lora</span>
          </div>
          <span className="text-xs font-mono shrink-0" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            /
          </span>
          <span
            className="text-[10px] sm:text-xs font-mono px-2 py-0.5 border font-bold truncate max-w-[130px] sm:max-w-none"
            style={{
              background: 'var(--md-sys-color-surface-container)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              borderRadius: 'var(--md-sys-shape-corner-extra-small)'
            }}
          >
            {session.role === 'simpul'
              ? 'simpul-executive-analytics'
              : session.role === 'lora'
                ? 'lora-mobile-courier'
                : 'kdak-spatial-transparency-map'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 border"
            style={{
              background: 'var(--md-sys-color-surface-container-low)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              borderRadius: 'var(--md-sys-shape-corner-full)'
            }}
          >
            <img
              src={session.avatarUrl}
              alt={session.name}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover border shrink-0"
              style={{ borderColor: 'var(--md-sys-color-outline)' }}
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none truncate max-w-[120px]">{session.name}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar dari Akun"
            type="button"
            className="m3-btn-secondary flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-mono shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>

    <main>{children}</main>
  </div>
);

const AppRoutes: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) return;
    const roleFromPath = pathToRole(location.pathname);
    if (location.pathname === '/' || location.pathname === '') {
      navigate(ROLE_PATH[session.role], { replace: true });
      return;
    }
    if (roleFromPath && roleFromPath !== session.role) {
      navigate(ROLE_PATH[session.role], { replace: true });
    }
  }, [session, location.pathname, navigate]);

  const handleLoginSuccess = (userSession: UserSession) => {
    persistSession(userSession);
    setSession(userSession);
    navigate(ROLE_PATH[userSession.role], { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate('/', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<LoginView onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell session={session} onLogout={handleLogout}>
      <Routes>
        <Route path="/simpul" element={<KdaksDashboardView />} />
        <Route path="/lora" element={<LoraTaskView />} />
        <Route path="/public" element={<PublicMapView />} />
        <Route path="/" element={<Navigate to={ROLE_PATH[session.role]} replace />} />
        <Route path="*" element={<Navigate to={ROLE_PATH[session.role]} replace />} />
      </Routes>
    </AppShell>
  );
};

export const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
