import React, { useState } from 'react';

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
  const [selectedCluster, setSelectedCluster] = useState<number | 'ALL'>('ALL');
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
    return matchesSearch;
  });

  const handleOpenDispute = (puskesmasName: string) => {
    setSelectedPuskesmas(puskesmasName);
    setDisputeSubmitted(false);
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setTimeout(() => {
      setShowDisputeModal(false);
      setDisputeNotes('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] p-6 font-sans text-white">
      {/* Top Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-[hsl(217,33%,12%)] p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(174,100%,41%)] text-gray-950 font-bold">
            GIS
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[hsl(174,100%,41%)]">
              K-DAK Public Stock Transparency Map
            </h1>
            <p className="text-xs text-gray-400">Peta Spasial 34 Provinsi & Transparansi Ketersediaan Obat Publik</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[hsl(174,80%,18%)] px-3 py-1 text-xs font-semibold text-[hsl(174,100%,80%)] border border-[hsl(174,100%,41%,0.3)]">
            Akses Publik Terbuka
          </span>
        </div>
      </header>

      {/* Spatial Cluster Indicator Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          onClick={() => setSelectedCluster(selectedCluster === 1 ? 'ALL' : 1)}
          className={`cursor-pointer rounded-[16px] border p-4 transition ${
            selectedCluster === 1 ? 'border-emerald-400 bg-emerald-500/20' : 'border-emerald-500/30 bg-emerald-500/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">KLUSTER I (KETAHANAN TINGGI)</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">9 Prov</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-white">92,2% Rerata Stok</p>
          <p className="text-xs text-gray-400">Rasio Apoteker: 0,88 per puskesmas</p>
        </div>

        <div
          onClick={() => setSelectedCluster(selectedCluster === 2 ? 'ALL' : 2)}
          className={`cursor-pointer rounded-[16px] border p-4 transition ${
            selectedCluster === 2 ? 'border-amber-400 bg-amber-500/20' : 'border-amber-500/30 bg-amber-500/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">KLUSTER II (KETAHANAN SEDANG)</span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">19 Prov</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-white">81,6% Rerata Stok</p>
          <p className="text-xs text-gray-400">Rasio Apoteker: 0,51 per puskesmas</p>
        </div>

        <div
          onClick={() => setSelectedCluster(selectedCluster === 3 ? 'ALL' : 3)}
          className={`cursor-pointer rounded-[16px] border p-4 transition ${
            selectedCluster === 3 ? 'border-rose-400 bg-rose-500/20' : 'border-rose-500/30 bg-rose-500/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400">KLUSTER III (KETAHANAN RENDAH)</span>
            <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">6 Prov</span>
          </div>
          <p className="mt-2 text-xl font-extrabold text-white">62,1% Rerata Stok</p>
          <p className="text-xs text-gray-400">Rasio Apoteker: 0,26 (Prioritas LORA)</p>
        </div>
      </div>

      {/* Public Search Bar */}
      <div className="mb-6 rounded-[16px] border border-[hsla(210,100%,75%,0.15)] bg-[hsl(217,30%,16%)] p-4 shadow-lg">
        <label className="mb-2 block text-xs font-semibold text-gray-300">Pencarian Stok Obat Esensial Publik:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Ketik nama obat (contoh: Oksitosin, OAT, Amoxicillin) atau nama Puskesmas/Provinsi..."
          className="w-full rounded-[12px] border border-[hsla(210,100%,75%,0.2)] bg-[hsl(222,47%,7%)] px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[hsl(174,100%,41%)] focus:outline-none"
        />
      </div>

      {/* Stock Search Results Table */}
      <div className="rounded-[16px] border border-[hsla(210,100%,75%,0.15)] bg-[hsl(217,30%,16%)] p-5 shadow-lg">
        <h2 className="mb-4 text-base font-bold text-white">Hasil Ketersediaan Stok Obat Esensial Faskes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[hsla(210,100%,75%,0.15)] text-gray-400">
              <tr>
                <th className="py-2">Puskesmas / Faskes</th>
                <th className="py-2">Provinsi</th>
                <th className="py-2">Nama Obat</th>
                <th className="py-2">Sisa Stok</th>
                <th className="py-2">Status</th>
                <th className="py-2">Audit Pengaduan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsla(210,100%,75%,0.05)]">
              {filteredStocks.map((item, index) => (
                <tr key={index} className="hover:bg-[hsl(217,25%,20%)]">
                  <td className="py-3 font-semibold text-white">{item.puskesmasName}</td>
                  <td className="py-3 text-gray-300">{item.provinceName}</td>
                  <td className="py-3 font-medium text-[hsl(174,100%,41%)]">{item.medicineName}</td>
                  <td className="py-3 font-mono font-bold text-white">{item.stockQty} unit</td>
                  <td className="py-3">
                    {item.status === 'AVAILABLE' && (
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300 border border-emerald-500/30">
                        Tersedia
                      </span>
                    )}
                    {item.status === 'LOW_BUFFER' && (
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300 border border-amber-500/30">
                        Buffer Menipis
                      </span>
                    )}
                    {item.status === 'STOCKOUT' && (
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs text-rose-300 border border-rose-500/30">
                        Stok Kosong
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleOpenDispute(item.puskesmasName)}
                      className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/20 transition"
                    >
                      ! Laporkan Selisih
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[24px] border border-[hsla(210,100%,75%,0.2)] bg-[hsl(217,30%,16%)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-rose-400">Form Pengaduan Audit Selisih Stok</h3>
            <p className="mt-1 text-xs text-gray-300">Faskes: {selectedPuskesmas}</p>

            {disputeSubmitted ? (
              <div className="my-6 rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-4 text-center text-xs text-emerald-300">
                ✓ Laporan dispute publik berhasil terverifikasi dan dikirim ke Inspektorat Kemenkes!
              </div>
            ) : (
              <form onSubmit={handleSubmitDispute} className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Catatan Temuan Lapangan:</label>
                  <textarea
                    required
                    rows={3}
                    value={disputeNotes}
                    onChange={e => setDisputeNotes(e.target.value)}
                    placeholder="Jelaskan selisih obat yang Anda alami saat di Puskesmas..."
                    className="w-full rounded-xl border border-[hsla(210,100%,75%,0.2)] bg-[hsl(222,47%,7%)] p-3 text-xs text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="w-1/2 rounded-full border border-gray-600 py-2 text-xs text-gray-300 hover:bg-gray-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 rounded-full bg-rose-500 py-2 text-xs font-bold text-white hover:bg-rose-600 transition"
                  >
                    Kirim Laporan Audit
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
