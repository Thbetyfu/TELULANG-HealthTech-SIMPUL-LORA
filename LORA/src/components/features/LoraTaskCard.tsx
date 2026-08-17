import React from 'react';
import { LoraTask } from '../../types/task.type';
import { Thermometer, ShieldAlert, ArrowRight } from 'lucide-react';

interface LoraTaskCardProps {
  task: LoraTask;
  onSelectTask: (task: LoraTask) => void;
}

export const LoraTaskCard: React.FC<LoraTaskCardProps> = ({ task, onSelectTask }) => {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-xl transition-all duration-300 hover:border-[hsl(172,85%,45%,0.3)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">#{task.id}</span>
        <span
          className={`rounded-full px-3 py-0.5 text-[10px] font-extrabold ${
            task.status === 'DELIVERED'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          {task.status}
        </span>
      </div>

      <div>
        <h3 className="text-base font-extrabold text-white">{task.targetFacilityName}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{task.targetAddress}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-3 text-xs">
        <span className="font-bold text-[hsl(172,85%,45%)]">
          Obat: {task.medicineName} ({task.quantity} unit)
        </span>
        {task.requiresColdChain && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
            <Thermometer className="w-3 h-3 text-rose-400" />
            <span>Cold-Chain (2–8°C)</span>
          </span>
        )}
        {task.isHardDrug && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Obat Keras (Escort Apt)</span>
          </span>
        )}
      </div>

      <button
        onClick={() => onSelectTask(task)}
        className="flex items-center justify-center gap-2 w-full rounded-full bg-[hsl(172,85%,45%)] py-2.5 text-xs font-black text-gray-950 transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[hsl(172,85%,45%,0.15)]"
      >
        <span>Buka Tugas & Proof of Delivery</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
