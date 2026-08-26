import React, { useState } from 'react';
import {
  Building2,
  Truck,
  Globe,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { SimpulLoraUnifiedLogoSvg } from '../components/Logos';
import { loginWithApi, type AuthRole, type UserSession } from '../services/auth.service';

export type { UserSession, AuthRole };

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

const DEMO_HINTS: Record<AuthRole, { id: string; password: string }> = {
  simpul: { id: '19850412 201001 2 004', password: 'simpul123' },
  lora: { id: 'LORA-KURIR-882', password: 'lora123' },
  public: { id: 'PUBLIC-GUEST', password: '' }
};

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<AuthRole>('simpul');
  const [emailOrNip, setEmailOrNip] = useState(DEMO_HINTS.simpul.id);
  const [password, setPassword] = useState(DEMO_HINTS.simpul.password);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role: AuthRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setEmailOrNip(DEMO_HINTS[role].id);
    setPassword(DEMO_HINTS[role].password);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrNip.trim() && selectedRole !== 'public') {
      setErrorMsg('Silakan masukkan NIP / ID Pengguna terdaftar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const session = await loginWithApi({
        identifier: emailOrNip.trim() || DEMO_HINTS.public.id,
        password: selectedRole === 'public' ? '' : password,
        role: selectedRole
      });
      onLoginSuccess(session);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleButtonClass = (role: AuthRole) =>
    selectedRole === role
      ? 'bg-[var(--md-sys-color-surface-container)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] font-bold'
      : 'bg-[var(--md-sys-color-surface)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]';

  return (
    <div
      className="min-h-screen font-sans flex flex-col justify-between"
      style={{
        background: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)'
      }}
    >
      <header
        className="px-8 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--md-sys-color-outline-variant)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SimpulLoraUnifiedLogoSvg className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider">SIMPUL-LORA</span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            /
          </span>
          <span className="text-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            Role-Based Access Gate
          </span>
        </div>
      </header>

      <main className="my-auto py-12 px-6">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8 space-y-3">
            <div
              className="inline-flex h-14 w-14 items-center justify-center mb-1 border"
              style={{
                background: 'var(--md-sys-color-surface-container-low)',
                borderColor: 'var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-large)'
              }}
            >
              <SimpulLoraUnifiedLogoSvg className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Log in to SIMPUL-LORA</h1>
            <p className="text-xs max-w-xs mx-auto" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Sistem Informasi Manajemen Logistik Farmasi & Rekonsiliasi Obat Nasional
            </p>
          </div>

          <div
            className="border p-6 shadow-2xl space-y-5"
            style={{
              background: 'var(--md-sys-color-surface-container-low)',
              borderColor: 'var(--md-sys-color-outline-variant)',
              borderRadius: 'var(--md-sys-shape-corner-medium)'
            }}
          >
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label
                  className="text-xs font-mono block mb-2 uppercase tracking-wider"
                  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  Pilih Peran Akun Anda:
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('simpul')}
                    className={`w-full p-3 border text-left flex items-center justify-between transition-colors ${roleButtonClass('simpul')}`}
                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4" style={{ color: 'var(--md-sys-color-primary)' }} />
                      <div>
                        <p className="text-xs font-bold">Dinas Kesehatan & Apoteker</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                          Portal SIMPUL Executive Dashboard
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('lora')}
                    className={`w-full p-3 border text-left flex items-center justify-between transition-colors ${roleButtonClass('lora')}`}
                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4" style={{ color: 'var(--md-sys-color-secondary)' }} />
                      <div>
                        <p className="text-xs font-bold">Kurir Logistik Rakyat</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                          LORA Mobile Courier PWA
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('public')}
                    className={`w-full p-3 border text-left flex items-center justify-between transition-colors ${roleButtonClass('public')}`}
                    style={{ borderRadius: 'var(--md-sys-shape-corner-small)' }}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4" style={{ color: 'var(--md-sys-color-primary)' }} />
                      <div>
                        <p className="text-xs font-bold">Masyarakat Umum (Publik)</p>
                        <p className="text-[10px] font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                          Peta Transparansi Stok 34 Provinsi
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {errorMsg && (
                  <div
                    className="p-3 border text-xs flex items-center gap-2"
                    style={{
                      background: 'var(--md-sys-color-error-container)',
                      borderColor: 'var(--md-sys-color-error)',
                      color: 'var(--md-sys-color-on-error-container)',
                      borderRadius: 'var(--md-sys-shape-corner-small)'
                    }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {selectedRole !== 'public' ? (
                  <>
                    <div>
                      <span
                        className="text-[11px] font-mono block mb-1"
                        style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                      >
                        NIP / ID Pengguna Terdaftar
                      </span>
                      <div className="relative">
                        <User
                          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        />
                        <input
                          type="text"
                          required
                          placeholder="Masukkan NIP atau ID..."
                          value={emailOrNip}
                          onChange={(e) => setEmailOrNip(e.target.value)}
                          className="w-full border pl-9 pr-3 py-2.5 text-xs outline-none font-mono"
                          style={{
                            background: 'var(--md-sys-color-surface)',
                            borderColor: 'var(--md-sys-color-outline-variant)',
                            color: 'var(--md-sys-color-on-surface)',
                            borderRadius: 'var(--md-sys-shape-corner-small)'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <span
                        className="text-[11px] font-mono block mb-1"
                        style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                      >
                        Kata Sandi (Password)
                      </span>
                      <div className="relative">
                        <KeyRound
                          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        />
                        <input
                          type="password"
                          required
                          placeholder="Masukkan kata sandi..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border pl-9 pr-3 py-2.5 text-xs outline-none font-mono"
                          style={{
                            background: 'var(--md-sys-color-surface)',
                            borderColor: 'var(--md-sys-color-outline-variant)',
                            color: 'var(--md-sys-color-on-surface)',
                            borderRadius: 'var(--md-sys-shape-corner-small)'
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-mono" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Demo: {selectedRole === 'simpul' ? 'simpul123' : 'lora123'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div
                    className="p-3 border text-xs font-mono"
                    style={{
                      background: 'var(--md-sys-color-surface-container)',
                      borderColor: 'var(--md-sys-color-outline-variant)',
                      color: 'var(--md-sys-color-on-surface-variant)',
                      borderRadius: 'var(--md-sys-shape-corner-small)'
                    }}
                  >
                    Akses Portal Publik tidak memerlukan kata sandi. Token JWT guest akan diterbitkan oleh BE.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="m3-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting ? 'Mengautentikasi...' : `Masuk ke Workspace ${selectedRole.toUpperCase()}`}
                </span>
              </button>
            </form>
          </div>

          <div
            className="mt-8 text-center text-xs flex items-center justify-center gap-2 font-mono"
            style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>JWT RBAC via Express /api/v1/auth/login</span>
          </div>
        </div>
      </main>

      <footer
        className="px-8 py-4 border-t text-xs flex items-center justify-between"
        style={{
          borderColor: 'var(--md-sys-color-outline-variant)',
          color: 'var(--md-sys-color-on-surface-variant)'
        }}
      >
        <div>
          <span className="font-semibold" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            SIMPUL-LORA Platform
          </span>{' '}
          &copy; 2026 — Satria Data SEC_(SD2026020000224)
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span>Vite SPA + Express BE</span>
        </div>
      </footer>
    </div>
  );
};
