import React from 'react';
import { 
  Building2, 
  Truck, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  Database,
  Lock,
  HeartPulse
} from 'lucide-react';

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  targetPath: string;
  imageUrl: string;
  icon: React.ReactNode;
  features: string[];
}

interface RoleSelectorLandingViewProps {
  onSelectRole: (path: string) => void;
}

export const RoleSelectorLandingView: React.FC<RoleSelectorLandingViewProps> = ({ onSelectRole }) => {
  const roles: RoleOption[] = [
    {
      id: 'simpul',
      title: 'Dinas Kesehatan & Apoteker',
      subtitle: 'SIMPUL Strategic Executive Portal',
      description: 'Dashboard analitis strategis eksekutif K-DAK untuk rekonsiliasi data, peramalan stok, dan alarm disparitas BPJS P-Care.',
      badge: 'Executive Dashboard',
      targetPath: '/simpul',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      icon: <Building2 className="w-6 h-6 text-[#4cd9c0]" />,
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
      description: 'Aplikasi kurir lapangan berbasis Progressive Web App (PWA) dengan dukungan offline-first dan penguncian lokasi GPS.',
      badge: 'Mobile PWA App',
      targetPath: '/lora',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      icon: <Truck className="w-6 h-6 text-[#89ceeb]" />,
      features: [
        'Penguncian Sinyal GPS Geolocation',
        'Monitoring Rantai Dingin Cold-Chain (2–8°C)',
        'Bukti Pengiriman Canvas TTE Digital',
        'Offline Synchronization via Dexie.js'
      ]
    },
    {
      id: 'public',
      title: 'Masyarakat Umum (Publik)',
      subtitle: 'K-DAK Public Transparency Portal',
      description: 'Peta transparansi spasial stok obat esensial 34 provinsi dan portal pengaduan dispute publik yang akuntabel.',
      badge: 'Public Web Portal',
      targetPath: '/public',
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
      icon: <Globe className="w-6 h-6 text-[#ffb4ab]" />,
      features: [
        'Peta Spasial GIS 34 Provinsi Interaktif',
        'Pencarian Stok Obat Esensial Faskes',
        'Form Pengaduan Audit Selisih Stok',
        'Integrasi Inspektorat Kemenkes'
      ]
    }
  ];

  const featuresShowcase = [
    {
      icon: <BarChart3 className="w-6 h-6 text-[#4cd9c0]" />,
      title: 'Peramalan Spasial OLS & K-Means',
      desc: 'Engine analitis statistik otomatis memprediksi lonjakan kebutuhan obat esensial berbasis rasio apoteker dan klaster wilayah.'
    },
    {
      icon: <Database className="w-6 h-6 text-[#89ceeb]" />,
      title: 'Integrasi SATUSEHAT FHIR API',
      desc: 'Sinkronisasi data rekam medis dan klaim BPJS P-Care secara real-time untuk eliminasi potensi kecurangan dan selisih stok.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#ffb4ab]" />,
      title: 'PWA Offline & GPS Field Tracking',
      desc: 'Kurir LORA dapat beroperasi di daerah terpencil tanpa koneksi internet dengan jaminan keamanan suhu rantai dingin (2-8°C).'
    },
    {
      icon: <Lock className="w-6 h-6 text-[#b0ccc4]" />,
      title: 'Tanda Tangan TTE Canvas Legal',
      desc: 'Verifikasi penerimaan obat dengan tanda tangan digital TTE berbasis HTML5 Canvas & bukti audit foto geotagging.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1418] text-[#e1e3e5] font-sans flex flex-col justify-between selection:bg-[#4cd9c0] selection:text-[#003730]">
      {/* Background Decorative M3 Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#4cd9c0]/[0.06] blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#004c6a]/[0.15] blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[#93000a]/[0.05] blur-[120px]" />
      </div>

      {/* Header App Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1418]/80 border-b border-white/10 px-6 py-4 transition-all">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#4cd9c0] text-[#003730] font-black text-base shadow-lg shadow-[#4cd9c0]/20">
              <HeartPulse className="w-6 h-6 text-[#003730]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  SIMPUL-LORA
                </h1>
                <span className="rounded-full bg-[#005046] px-3 py-0.5 text-[11px] font-bold text-[#6ff6dc] border border-[#4cd9c0]/30">
                  Satria Data 2026
                </span>
              </div>
              <p className="text-xs text-[#c0c8c5]">Google Material Design 3 Healthcare Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-[#1b2024] px-4 py-1.5 text-xs border border-white/10 text-[#c0c8c5]">
              <ShieldCheck className="w-4 h-4 text-[#4cd9c0]" />
              <span>SATUSEHAT FHIR Specification Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#005046]/60 px-4 py-1.5 text-xs font-semibold text-[#6ff6dc] border border-[#4cd9c0]/30">
                <Sparkles className="w-4 h-4 text-[#4cd9c0]" />
                <span>Statistics Essay Competition SEC_(SD2026020000224)</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Transformasi Digital <br />
                <span className="bg-gradient-to-r from-[#4cd9c0] via-[#89ceeb] to-white bg-clip-text text-transparent">
                  Rantai Pasok Obat Nasional
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-[#c0c8c5] leading-relaxed max-w-2xl">
                Ekosistem pintar integrasi <strong>SIMPUL</strong> (Portal Analitis Eksekutif K-DAK) dan <strong>LORA</strong> (Logistik Rakyat PWA) untuk menjamin ketersediaan obat esensial hingga pelosok Indonesia.
              </p>

              {/* Key Metrics Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-xl">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#4cd9c0]">34</p>
                  <p className="text-xs text-[#c0c8c5] font-medium">Provinsi Tercover</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#89ceeb]">80.0%</p>
                  <p className="text-xs text-[#c0c8c5] font-medium">Akurasi OLS (R²)</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#ffb4ab]">2–8°C</p>
                  <p className="text-xs text-[#c0c8c5] font-medium">Rantai Dingin</p>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[28px] overflow-hidden border border-white/15 shadow-2xl bg-[#1b2024]">
                <img 
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80" 
                  alt="Logistik Kesehatan Indonesia"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1418] via-[#0f1418]/40 to-transparent flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 bg-[#4cd9c0]/20 text-[#4cd9c0] backdrop-blur-md rounded-full text-xs font-bold w-fit mb-2 border border-[#4cd9c0]/40">
                    Unified Platform
                  </span>
                  <h3 className="text-lg font-bold text-white">Monitoring Rantai Pasok Spasial Real-time</h3>
                  <p className="text-xs text-[#c0c8c5] mt-1">Solusi komprehensif eliminasi kelangkaan dan kecurangan obat esensial.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Role Cards Section */}
      <section className="relative z-10 py-12 px-6 bg-[#171c20]/60 border-y border-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Pilih Akses Portal Sesuai Peran Anda
            </h2>
            <p className="text-sm text-[#c0c8c5] mt-2 max-w-xl mx-auto">
              Silakan pilih salah satu dari 3 aplikasi terintegrasi berikut untuk memulai.
            </p>
          </div>

          {/* 3 Material Design 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map(role => (
              <div
                key={role.id}
                onClick={() => onSelectRole(role.targetPath)}
                className="group relative flex flex-col justify-between rounded-[28px] border border-white/10 bg-[#1b2024] overflow-hidden shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#4cd9c0]/50 hover:bg-[#262b2f] cursor-pointer"
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={role.imageUrl} 
                    alt={role.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b2024] via-[#1b2024]/30 to-transparent" />
                  
                  <div className="absolute top-4 right-4 bg-[#0f1418]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    {role.badge}
                  </div>

                  <div className="absolute bottom-4 left-6 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#0f1418] border border-white/10 shadow-lg">
                    {role.icon}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#4cd9c0] transition-colors">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-[#89ceeb] tracking-wide uppercase">{role.subtitle}</p>
                    <p className="mt-3 text-xs leading-relaxed text-[#c0c8c5]">{role.description}</p>

                    {/* Features List */}
                    <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-4">
                      {role.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-[#e1e3e5]">
                          <CheckCircle2 className="w-4 h-4 text-[#4cd9c0] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-8 flex items-center justify-between rounded-full bg-[#0f1418] px-5 py-3 border border-white/10 group-hover:border-[#4cd9c0]/50 group-hover:bg-[#005046] transition-all">
                    <span className="text-xs font-bold text-white group-hover:text-[#6ff6dc]">
                      Masuk Portal {role.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#4cd9c0] group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#4cd9c0]">Keunggulan Arsitektur</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">4 Pilar Teknologi SIMPUL-LORA</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresShowcase.map((item, idx) => (
              <div key={idx} className="p-6 rounded-[24px] bg-[#1b2024] border border-white/10 hover:border-[#4cd9c0]/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#0f1418] border border-white/10 mb-4">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-[#c0c8c5] leading-relaxed mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 backdrop-blur-md bg-[#0f1418]/90">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#c0c8c5]">
          <div>
            <span className="font-bold text-white">SIMPUL-LORA Ecosystem</span> &copy; 2026 &mdash; Satria Data Statistics Essay Competition SEC_(SD2026020000224)
          </div>
          <div className="flex items-center gap-4 text-xs text-[#8a9390]">
            <span>Google Material Design 3</span>
            <span>•</span>
            <span>SATUSEHAT FHIR Compliant</span>
            <span>•</span>
            <span>Single Vercel Monorepo</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
