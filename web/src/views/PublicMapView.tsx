import React, { useState } from 'react';
import { IndonesiaSpatialMap } from '../components/IndonesiaSpatialMap';
import { Globe, AlertCircle, CheckCircle2, Send, X, Search } from 'lucide-react';

interface MedicineStockItem {
  puskesmasName: string;
  provinceName: string;
  medicineName: string;
  kfaCode: string;
  stockQty: number;
  status: 'AVAILABLE' | 'LOW_BUFFER' | 'STOCKOUT';
  lastUpdated: string;
}

export const PublicMapView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedPuskesmas, setSelectedPuskesmas] = useState<string>('');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const mockMedicineStocks: MedicineStockItem[] = [
    { puskesmasName: 'Puskesmas Bojongsoang', provinceName: 'Jawa Barat', medicineName: 'Oksitosin Injeksi 10 UI/mL', kfaCode: '93000122', stockQty: 110, status: 'AVAILABLE', lastUpdated: '2026-08-17 21:00' },
    { puskesmasName: 'Puskesmas Bojongsoang', provinceName: 'Jawa Barat', medicineName: 'Amoxicillin 500mg', kfaCode: '93000123', stockQty: 350, status: 'AVAILABLE', lastUpdated: '2026-08-17 20:30' },
    { puskesmasName: 'Pustu Desa Cihawuk', provinceName: 'Jawa Barat', medicineName: 'OAT Lini 2 (MDR-TB)', kfaCode: '93000124', stockQty: 0, status: 'STOCKOUT', lastUpdated: '2026-08-17 19:45' },
    { puskesmasName: 'Puskesmas Jayawijaya', provinceName: 'Papua', medicineName: 'Insulin Human Injeksi', kfaCode: '93000125', stockQty: 12, status: 'LOW_BUFFER', lastUpdated: '2026-08-17 18:15' },
    { puskesmasName: 'Puskesmas Maluku Tengah', provinceName: 'Maluku', medicineName: 'Oksitosin Injeksi 10 UI/mL', kfaCode: '93000122', stockQty: 0, status: 'STOCKOUT', lastUpdated: '2026-08-17 17:00' }
  ];

  const filteredStocks = mockMedicineStocks.filter(item => {
    const matchesSearch = item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.puskesmasName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.provinceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvinceFilter
      ? item.provinceName.toLowerCase() === selectedProvinceFilter.toLowerCase()
      : true;

    return matchesSearch && matchesProvince;
  });

  const handleOpenDispute = (puskesmasName: string) => {
    setSelectedPuskesmas(puskesmasName);
    setDisputeSubmitted(false);
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puskesmasName: selectedPuskesmas,
          provinceName: selectedProvinceFilter || 'Jawa Barat',
          disputeNotes: disputeNotes
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengunggah pengaduan dispute');
      }
      setDisputeSubmitted(true);
      setTimeout(() => {
        setShowDisputeModal(false);
        setDisputeNotes('');
      }, 1500);
    } catch (err: any) {
      alert('Error pengiriman pengaduan: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(230,25%,8%)] p-6 font-sans text-gray-100 max-w-7xl mx-auto selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* Top Header App Bar */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[hsl(172,85%,45%)] text-gray-950 font-black text-lg shadow-lg shadow-[hsl(172,85%,45%,0.25)]">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                K-DAK Public Stock Transparency Map
              </h1>
              <span className="rounded-full bg-[hsl(172,75%,14%)] px-3 py-0.5 text-xs font-bold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
                Public Open Access
              </span>
            </div>
            <p className="text-xs text-gray-400">Peta Spasial Transparansi Ketersediaan Obat Esensial Faskes & Form Audit Publik</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedProvinceFilter && (
            <button
              onClick={() => setSelectedProvinceFilter(null)}
              className="flex items-center gap-1 rounded-full bg-rose-500/20 px-4 py-1.5 text-xs font-bold text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus Filter: {selectedProvinceFilter}</span>
            </button>
          )}
          <span className="hidden sm:inline-block rounded-full bg-[hsl(230,25%,8%)] px-4 py-2 text-xs font-semibold text-gray-300 border border-white/[0.08]">
            34 Provinsi Aktif
          </span>
        </div>
      </header>

      {/* SVG Interactive Spatial GIS Map Component */}
      <div className="mb-8">
        <IndonesiaSpatialMap onSelectProvince={prov => setSelectedProvinceFilter(prov)} />
      </div>

      {/* Public Search Bar Container */}
      <div className="mb-8 rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-6 shadow-2xl">
        <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-white tracking-wide uppercase">
          <Search className="w-4 h-4 text-[hsl(172,85%,45%)]" />
          <span>Pencarian Stok Obat Esensial Publik:</span>
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Ketik nama obat (contoh: Oksitosin, OAT, Amoxicillin) atau nama Puskesmas/Provinsi..."
          className="w-full rounded-[16px] border border-white/[0.1] bg-[hsl(230,25%,8%)] px-5 py-3.5 text-xs text-white placeholder-gray-500 focus:border-[hsl(172,85%,45%)] focus:ring-2 focus:ring-[hsl(172,85%,45%,0.2)] focus:outline-none transition"
        />
      </div>

      {/* Stock Search Results Table */}
      <div className="rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white">Hasil Ketersediaan Stok Obat Esensial Faskes</h2>
          <span className="text-xs text-gray-400">{filteredStocks.length} Faskes Ditampilkan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-gray-400 uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-3">Puskesmas / Faskes</th>
                <th className="py-3 px-3">Provinsi</th>
                <th className="py-3 px-3">Nama Obat</th>
                <th className="py-3 px-3">Sisa Stok</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Audit Pengaduan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredStocks.map((item, index) => (
                <tr key={index} className="hover:bg-[hsl(230,25%,8%)] transition-colors">
                  <td className="py-4 px-3 font-extrabold text-white">{item.puskesmasName}</td>
                  <td className="py-4 px-3 text-gray-300">{item.provinceName}</td>
                  <td className="py-4 px-3 font-bold text-[hsl(172,85%,45%)]">{item.medicineName}</td>
                  <td className="py-4 px-3 font-mono font-black text-white">{item.stockQty} unit</td>
                  <td className="py-4 px-3">
                    {item.status === 'AVAILABLE' && (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                        Tersedia
                      </span>
                    )}
                    {item.status === 'LOW_BUFFER' && (
                      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                        Buffer Menipis
                      </span>
                    )}
                    {item.status === 'STOCKOUT' && (
                      <span className="rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-bold text-rose-300 border border-rose-500/30">
                        Stok Kosong
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() => handleOpenDispute(item.puskesmasName)}
                      className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition active:scale-95"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Laporkan Selisih</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Audit Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-white/[0.1] bg-[hsl(230,20%,14%)] p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Form Pengaduan Audit Selisih Stok</h3>
                <p className="text-xs text-gray-400">Target Faskes: <span className="text-rose-300 font-bold">{selectedPuskesmas}</span></p>
              </div>
            </div>

            {disputeSubmitted ? (
              <div className="flex items-center justify-center gap-2 my-6 rounded-[20px] border border-emerald-500/30 bg-emerald-500/20 p-5 text-center text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Laporan dispute publik berhasil terverifikasi dan dikirim ke Inspektorat Kemenkes!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="mt-5 flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Catatan Temuan Lapangan Masyarakat:</label>
                  <textarea
                    required
                    rows={4}
                    value={disputeNotes}
                    onChange={e => setDisputeNotes(e.target.value)}
                    placeholder="Jelaskan selisih stok atau kejanggalan yang Anda alami saat di Puskesmas..."
                    className="w-full rounded-[16px] border border-white/[0.1] bg-[hsl(230,25%,8%)] p-4 text-xs text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none transition"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="w-1/2 rounded-full border border-white/[0.1] py-3 text-xs font-bold text-gray-300 hover:bg-white/[0.05] transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-1/2 rounded-full bg-rose-500 py-3 text-xs font-black text-white hover:bg-rose-600 transition shadow-lg active:scale-95"
                  >
                    <Send className="w-4 h-4 fill-current" />
                    <span>Kirim Laporan Audit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
