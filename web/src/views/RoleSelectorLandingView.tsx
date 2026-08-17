import React from 'react';
import { Building2, Truck, Globe, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  targetPath: string;
  features: string[];
}

interface RoleSelectorLandingViewProps {
  onSelectRole: (path: string) => void;
}

export const RoleSelectorLandingView: React.FC<RoleSelectorLandingViewProps> = ({ onSelectRole }: RoleSelectorLandingViewProps) => {
  const roles: RoleOption[] = [
    {
      id: 'simpul',
      title: 'Dinas Kesehatan & Apoteker',
      subtitle: 'SIMPUL Strategic Executive Portal',
      description: 'Dashboard analitis strategis eksekutif K-DAK untuk manajemen stok obat esensial 34 provinsi di Indonesia.',
      icon: <Building2 className="w-7 h-7 text-[hsl(172,85%,45%)]" />,
      badge: 'Executive Web',
      targetPath: '/simpul',
      features: [
        'Model Peramalan OLS (R² = 80.0%)',
        'Pengelompokan Klaster K-Means (k=3)',
        'Discrepancy Alarm SATUSEHAT API',
        'Engine Rekomendasi Redistribusi Stok'
      ]
    },
    {
      id: 'lora',
      title: 'Kurir Logistik Rakyat (LORA)',
      subtitle: 'LORA Field Courier Mobile App',
      description: 'Aplikasi kurir lapangan berbasis PWA dengan dukungan pengiriman obat hingga wilayah 3TP (Terdepan, Terluar, Tertinggal).',
      icon: <Truck className="w-7 h-7 text-[hsl(210,90%,65%)]" />,
      badge: 'Mobile PWA',
      targetPath: '/lora',
      features: [
        'Penguncian Sinyal GPS Geolocation',
        'Monitoring Rantai Dingin Cold-Chain (2–8°C)',
        'Bukti Pengiriman Canvas TTE Digital',
        'Validasi Proof of Delivery (PoD) Cloud'
      ]
    },
    {
      id: 'public',
      title: 'Masyarakat Umum (Publik)',
      subtitle: 'K-DAK Public Transparency Portal',
      description: 'Peta transparansi spasial 34 provinsi untuk memantau ketersediaan stok obat esensial dan mengajukan audit pengaduan.',
      icon: <Globe className="w-7 h-7 text-[hsl(340,85%,65%)]" />,
      badge: 'Public Web',
      targetPath: '/public',
      features: [
        'Peta Spasial GIS 34 Provinsi Interaktif',
        'Pencarian Stok Obat Esensial Faskes',
        'Form Pengaduan Audit Selisih Stok',
        'Integrasi Inspektorat Kemenkes'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(230,25%,8%)] text-gray-100 font-sans flex flex-col justify-between selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* Background Decorative Material 3 Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[hsl(172,85%,45%,0.08)] blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[hsl(260,80%,65%,0.08)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-[hsl(210,90%,65%,0.06)] blur-3xl" />
      </div>

      {/* M3 Top App Bar Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[hsl(230,25%,8%,0.85)] border-b border-white/[0.08] px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[hsl(172,85%,45%)] text-gray-950 font-black text-sm shadow-lg shadow-[hsl(172,85%,45%,0.2)]">
              M3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">
                  SIMPUL-LORA
                </h1>
                <span className="rounded-full bg-[hsl(172,75%,14%)] px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
                  v2.4 Production
                </span>
              </div>
              <p className="text-xs text-gray-400">Google Material Design 3 Healthcare Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-[hsl(230,20%,14%)] px-3.5 py-1.5 text-xs border border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300 font-medium">SATUSEHAT FHIR API Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero & M3 Surface Selector Cards */}
      <main className="relative z-10 my-auto py-12 px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(172,75%,14%)] px-4 py-1.5 text-xs font-semibold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.2)] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(172,85%,45%)]" />
            <span>Satria Data 2026 - Statistics Essay Competition (SEC)</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-white leading-tight">
            Sistem Informasi Manajemen Pulih & Logistik Rakyat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Platform transformasi rantai pasok obat esensial nasional berbasis peramalan spasial OLS, K-Means clustering, dan distribusi kurir terintegrasi.
          </p>
        </div>

        {/* 3 Material Design 3 Cards Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.targetPath)}
              className="group relative flex flex-col justify-between rounded-[28px] border border-white/[0.1] bg-[hsl(230,20%,14%)] p-7 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[hsl(172,85%,45%,0.5)] hover:bg-[hsl(230,18%,18%)] hover:shadow-2xl hover:shadow-[hsl(172,85%,45%,0.12)] cursor-pointer"
            >
              <div>
                {/* M3 Card Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[hsl(230,25%,8%)] border border-white/[0.08] shadow-inner group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <span className="rounded-full bg-[hsl(172,75%,14%)] px-3 py-1 text-xs font-bold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.2)]">
                    {role.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white group-hover:text-[hsl(172,85%,45%)] transition-colors">
                  {role.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-cyan-400 tracking-wide uppercase">{role.subtitle}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-300">{role.description}</p>

                {/* Feature Checkmarks List */}
                <ul className="mt-5 space-y-2 border-t border-white/[0.08] pt-4">
                  {role.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(172,85%,45%)] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* M3 Card Action Footer */}
              <div className="mt-8 flex items-center justify-between rounded-full bg-[hsl(230,25%,8%)] px-5 py-3 border border-white/[0.08] group-hover:border-[hsl(172,85%,45%,0.4)] group-hover:bg-[hsl(172,75%,14%)] transition-all">
                <span className="text-xs font-bold text-gray-200 group-hover:text-[hsl(172,90%,82%)]">
                  Buka Portal {role.badge}
                </span>
                <ArrowRight className="w-4 h-4 text-[hsl(172,85%,45%)] group-hover:translate-x-1 group-hover:text-white transition-all" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-6 px-6 backdrop-blur-md bg-[hsl(230,25%,8%,0.9)]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <span className="font-bold text-white">SIMPUL-LORA Platform</span> &copy; 2026 &mdash; Satria Data Statistics Essay Competition SEC_(SD2026020000224)
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span>Google Material Design 3 Spec</span>
            <span>•</span>
            <span>SATUSEHAT FHIR Specification</span>
            <span>•</span>
            <span>Single Vercel Monorepo</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
