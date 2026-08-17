import React from 'react';

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  targetPath: string;
}

interface RoleSelectorLandingViewProps {
  onSelectRole: (path: string) => void;
}

export const RoleSelectorLandingView: React.FC<RoleSelectorLandingViewProps> = ({ onSelectRole }: RoleSelectorLandingViewProps) => {
  const roles: RoleOption[] = [
    {
      id: 'simpul',
      title: 'Dinas Kesehatan & Apoteker',
      subtitle: 'SIMPUL Strategic Management Dashboard',
      description: 'Akses portal analitis eksekutif K-DAK, forecasting OLS regresi R2=80.0%, K-Means cluster, dan alarm selisih stok real-time.',
      icon: '🏛️',
      badge: 'Executive Web',
      targetPath: '/simpul'
    },
    {
      id: 'lora',
      title: 'Kurir Logistik Rakyat (LORA)',
      subtitle: 'LORA Field Courier Mobile App',
      description: 'Aplikasi kurir lapangan berbasis PWA dengan dukungan mode offline-first, locking GPS geolocation, sensor cold-chain, dan TTE PoD.',
      icon: '🚚',
      badge: 'Mobile PWA',
      targetPath: '/lora'
    },
    {
      id: 'public',
      title: 'Masyarakat Umum (Publik)',
      subtitle: 'K-DAK Public Transparency Portal',
      description: 'Pantau peta ketersediaan stok obat esensial 34 provinsi secara terbuka dan ajukan form audit dispute jika terjadi kelangkaan fisik.',
      icon: '🌐',
      badge: 'Public Web',
      targetPath: '/public'
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] p-6 font-sans text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-[hsla(210,100%,75%,0.1)] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(174,100%,41%)] text-gray-950 font-bold">
            M3
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[hsl(174,100%,41%)]">
              SIMPUL-LORA Healthcare Platform
            </h1>
            <p className="text-xs text-gray-400">Single Vercel Unified Web Deployment (`simpul-lora.vercel.app`)</p>
          </div>
        </div>

        <span className="rounded-full bg-[hsl(174,80%,18%)] px-4 py-1.5 text-xs font-semibold text-[hsl(174,100%,80%)] border border-[hsl(174,100%,41%,0.3)]">
          Single Vercel Active
        </span>
      </header>

      {/* Main Hero & Role Selector Cards */}
      <main className="my-auto py-8">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <span className="inline-block rounded-full bg-[hsl(190,80%,18%)] px-4 py-1 text-xs font-semibold text-[hsl(190,100%,80%)] mb-3">
            Google Material Design 3 (M3 / Material You)
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Pilih Peran Aplikasi Yang Ingin Anda Akses
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Satu platform terpadu untuk Dinas Kesehatan, Apoteker Puskesmas, Kurir Komunitas LORA, dan Masyarakat Umum.
          </p>
        </div>

        {/* 3 Material Design 3 Role Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.targetPath)}
              className="group relative flex flex-col justify-between rounded-[24px] border border-[hsla(210,100%,75%,0.15)] bg-[hsl(217,30%,16%)] p-6 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:bg-[hsl(217,25%,20%)] cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{role.icon}</span>
                  <span className="rounded-full bg-[hsl(174,80%,18%)] px-3 py-1 text-xs font-semibold text-[hsl(174,100%,80%)]">
                    {role.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[hsl(174,100%,41%)] transition-colors">
                  {role.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-cyan-400">{role.subtitle}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-300">{role.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[hsla(210,100%,75%,0.1)] pt-4 text-xs font-bold text-[hsl(174,100%,41%)]">
                <span>Masuk Ke Aplikasi</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsla(210,100%,75%,0.1)] pt-4 text-center text-xs text-gray-500">
        Platform SIMPUL-LORA &copy; 2026 - Satria Data Statistics Essay Competition SEC_(SD2026020000224)
      </footer>
    </div>
  );
};
