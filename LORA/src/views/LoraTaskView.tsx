import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { LoraTaskCard } from '../components/features/LoraTaskCard';
import { SignatureCanvas } from '../components/ui/SignatureCanvas';
import { LoraTask } from '../types/task.type';

export const LoraTaskView: React.FC = () => {
  const geo = useGeolocation();
  const [selectedTask, setSelectedTask] = useState<LoraTask | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock Active Tasks for Field Couriers
  const mockTasks: LoraTask[] = [
    {
      id: 'TASK-LORA-9981',
      sourceFacilityName: 'IFK Kabupaten Bandung',
      targetFacilityName: 'Pustu Desa Sukamaju',
      targetAddress: 'Kec. Bojongsoang, Kab. Bandung',
      medicineName: 'Oksitosin Injeksi 10 UI/mL',
      quantity: 50,
      requiresColdChain: true,
      isHardDrug: false,
      status: 'ASSIGNED',
      estimatedMinutes: 48.5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'TASK-LORA-9982',
      sourceFacilityName: 'Puskesmas Bojongsoang',
      targetFacilityName: 'Pustu Desa Cihawuk',
      targetAddress: 'Kec. Kertasari (Terpencil)',
      medicineName: 'OAT Lini 2 (MDR-TB)',
      quantity: 20,
      requiresColdChain: false,
      isHardDrug: true,
      status: 'ASSIGNED',
      estimatedMinutes: 62.0,
      createdAt: new Date().toISOString()
    }
  ];

  const handleSubmitPoD = () => {
    if (!signature) {
      alert('Tanda tangan digital penerima (TTE) wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] p-4 text-white font-sans">
      <header className="mb-6 flex items-center justify-between border-b border-[hsla(210,100%,75%,0.1)] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(174,100%,41%)]">
            LORA Mobile PWA
          </h1>
          <p className="text-xs text-gray-400">Logistik Rakyat Field Courier App</p>
        </div>
        <div className="text-right text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
          <span className="text-gray-300">PWA Online</span>
        </div>
      </header>

      {/* Geolocation Status Bar */}
      <div className="mb-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs">
        <span className="font-semibold text-cyan-300">GPS Location Lock: </span>
        {geo.loading ? (
          <span className="text-gray-400">Mencari sinyal GPS...</span>
        ) : geo.error ? (
          <span className="text-rose-400">{geo.error}</span>
        ) : (
          <span className="font-mono text-gray-200">
            {geo.latitude?.toFixed(6)}, {geo.longitude?.toFixed(6)} (Aklimasi ±{geo.accuracy?.toFixed(0)}m)
          </span>
        )}
      </div>

      {!selectedTask ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-300">Tugas Pengiriman Terjadwal ({mockTasks.length}):</h2>
          {mockTasks.map(task => (
            <LoraTaskCard key={task.id} task={task} onSelectTask={setSelectedTask} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-[hsla(210,100%,75%,0.2)] bg-[hsla(217,33%,17%,0.65)] p-5 backdrop-blur-md">
          <button
            onClick={() => { setSelectedTask(null); setSubmitted(false); }}
            className="self-start text-xs text-cyan-400 underline"
          >
            ← Kembali ke Daftar Tugas
          </button>

          <h2 className="text-lg font-bold text-white">Proof of Delivery: #{selectedTask.id}</h2>
          <p className="text-xs text-gray-300">Tujuan: {selectedTask.targetFacilityName}</p>

          {submitted ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-4 text-center text-xs text-emerald-300">
              ✓ Proof of Delivery berhasil disimpan dan di-sync ke Cloud PDN!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SignatureCanvas onSaveSignature={setSignature} />

              <button
                onClick={handleSubmitPoD}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[hsl(174,100%,41%)] py-3 text-sm font-bold text-gray-950 transition hover:bg-[hsl(174,100%,48%)] disabled:opacity-50"
              >
                {isSubmitting ? 'Mengunggah PoD...' : 'Kirim Proof of Delivery (PoD)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
