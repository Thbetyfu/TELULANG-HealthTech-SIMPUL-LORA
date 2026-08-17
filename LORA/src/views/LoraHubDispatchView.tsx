import React, { useState } from 'react';
import { LoraTask } from '../types/task.type';
import { Truck, CheckCircle2, Send, Thermometer, ShieldAlert } from 'lucide-react';

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
    <div className="min-h-screen bg-[hsl(230,25%,8%)] p-6 font-sans text-gray-100 max-w-7xl mx-auto selection:bg-[hsl(172,85%,45%)] selection:text-black">
      <header className="mb-8 flex items-center justify-between rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[hsl(172,85%,45%)] text-gray-950 shadow-lg shadow-[hsl(172,85%,45%,0.25)]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              LORA Hub Dispatch Portal
            </h1>
            <p className="text-xs text-gray-400">Pos Distribusi Logistik Rakyat (Last-Mile Community Dispatch)</p>
          </div>
        </div>
        <div className="rounded-full bg-[hsl(172,75%,14%)] px-4 py-2 text-xs font-bold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
          Kurir On-Duty: 18 Kurir
        </div>
      </header>

      {/* Metrics Banner */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Total Delivery Tasks</span>
          <span className="text-3xl font-black text-white block mt-1">{tasks.length}</span>
        </div>
        <div className="rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Rata-rata Lead Time</span>
          <span className="text-3xl font-black text-emerald-400 block mt-1">48.5 <span className="text-xs font-normal text-gray-400">menit (-19.2%)</span></span>
        </div>
        <div className="rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-xl">
          <span className="text-xs text-gray-400 font-medium">Rasio Kurir Komunitas</span>
          <span className="text-3xl font-black text-cyan-400 block mt-1">100% <span className="text-xs font-normal text-gray-400">Inklusif Lokal</span></span>
        </div>
      </div>

      {/* Task Dispatch Table */}
      <div className="rounded-[28px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-7 shadow-2xl">
        <h2 className="mb-6 text-lg font-black text-white">Antrean Dispatch Obat (Prioritas Klaster III)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-gray-400 uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3 px-3">Task ID</th>
                <th className="py-3 px-3">Destinasi Faskes</th>
                <th className="py-3 px-3">Obat</th>
                <th className="py-3 px-3">Cold-Chain</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-[hsl(230,25%,8%)] transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-cyan-400">#{task.id}</td>
                  <td className="py-4 px-3 font-extrabold text-white">{task.targetFacilityName}</td>
                  <td className="py-4 px-3 text-emerald-300 font-bold">{task.medicineName} ({task.quantity} unit)</td>
                  <td className="py-4 px-3">
                    {task.requiresColdChain ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-bold text-rose-300 border border-rose-500/30">
                        <Thermometer className="w-3 h-3 text-rose-400" />
                        <span>2–8°C</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">Suhu Ruang</span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    {task.status === 'PENDING' ? (
                      <button
                        onClick={() => handleDispatchTask(task.id)}
                        className="flex items-center gap-1.5 rounded-full bg-[hsl(172,85%,45%)] px-4 py-1.5 text-xs font-black text-gray-950 hover:scale-105 transition active:scale-95 shadow-md"
                      >
                        <Send className="w-3.5 h-3.5 fill-current" />
                        <span>Dispatch Kurir LORA</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Dalam Perjalanan</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
