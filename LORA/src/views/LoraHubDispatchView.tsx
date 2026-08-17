import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassBadge } from '../components/ui/GlassBadge';
import { LoraTask } from '../types/task.type';

export const LoraHubDispatchView: React.FC = () => {
  const [tasks, setTasks] = useState<LoraTask[]>([
    {
      id: 'TK-102',
      sourceFacilityName: 'IFK Kab. Bandung',
      targetFacilityName: 'Pustu Cihawuk',
      targetAddress: 'Kec. Kertasari',
      medicineName: 'Oksitosin Injeksi 10 UI/mL',
      quantity: 100,
      requiresColdChain: true,
      isHardDrug: false,
      status: 'PENDING',
      estimatedMinutes: 48.5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'TK-103',
      sourceFacilityName: 'IFK Kab. Bandung',
      targetFacilityName: 'Pustu Cibiru Terpencil',
      targetAddress: 'Kec. Cilengkrang',
      medicineName: 'OAT Lini 2 (MDR-TB)',
      quantity: 30,
      requiresColdChain: false,
      isHardDrug: true,
      status: 'PENDING',
      estimatedMinutes: 55.0,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleDispatchTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'IN_TRANSIT' } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(222,47%,7%)] p-6 font-sans text-white">
      <header className="mb-6 flex items-center justify-between border-b border-[hsla(210,100%,75%,0.1)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(174,100%,41%)]">
            LORA Hub Dispatch Portal
          </h1>
          <p className="text-xs text-gray-400">Pos Distribusi Logistik Rakyat (Last-Mile Community Dispatch)</p>
        </div>
        <div className="rounded-full bg-[hsl(190,80%,18%)] px-4 py-1.5 text-xs font-semibold text-[hsl(190,100%,80%)] border border-[hsl(190,95%,50%,0.3)]">
          Kurir On-Duty: 18 Kurir
        </div>
      </header>

      {/* Metrics Banner */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard variant="filled" className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Total Delivery Tasks</span>
          <span className="text-2xl font-bold text-white">{tasks.length}</span>
        </GlassCard>
        <GlassCard variant="filled" className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Rata-rata Lead Time</span>
          <span className="text-2xl font-bold text-emerald-400">48.5 menit (-19.2%)</span>
        </GlassCard>
        <GlassCard variant="filled" className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Rasio Kurir Komunitas</span>
          <span className="text-2xl font-bold text-cyan-400">100% Inklusif Lokal</span>
        </GlassCard>
      </div>

      {/* Task Dispatch Table */}
      <GlassCard variant="outlined">
        <h2 className="mb-4 text-base font-bold text-white">Antrean Dispatch Obat (Prioritas Klaster III)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[hsla(210,100%,75%,0.15)] text-gray-400">
              <tr>
                <th className="py-2">Task ID</th>
                <th className="py-2">Destinasi Faskes</th>
                <th className="py-2">Obat</th>
                <th className="py-2">Cold-Chain</th>
                <th className="py-2">Status</th>
                <th className="py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsla(210,100%,75%,0.05)]">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-[hsl(217,30%,16%)]">
                  <td className="py-3 font-mono font-bold text-cyan-400">#{task.id}</td>
                  <td className="py-3 font-semibold text-white">{task.targetFacilityName}</td>
                  <td className="py-3 text-emerald-300">{task.medicineName} ({task.quantity} unit)</td>
                  <td className="py-3">
                    {task.requiresColdChain ? (
                      <span className="rounded bg-rose-500/20 px-2 py-0.5 text-rose-300">2-8°C</span>
                    ) : (
                      <span className="text-gray-400">Suhu Ruang</span>
                    )}
                  </td>
                  <td className="py-3">
                    <GlassBadge
                      variant={task.status === 'IN_TRANSIT' ? 'pending' : 'cluster3'}
                      label={task.status}
                    />
                  </td>
                  <td className="py-3">
                    {task.status === 'PENDING' ? (
                      <button
                        onClick={() => handleDispatchTask(task.id)}
                        className="rounded-full bg-[hsl(174,100%,41%)] px-3 py-1 text-xs font-bold text-gray-950 transition hover:bg-[hsl(174,100%,48%)]"
                      >
                        Dispatch Kurir LORA
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold">✓ Dalam Perjalanan</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
