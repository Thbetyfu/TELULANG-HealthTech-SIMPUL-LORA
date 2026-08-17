import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlassBadge } from '../ui/GlassBadge';
import { LoraTask } from '../../types/task.type';

interface LoraTaskCardProps {
  task: LoraTask;
  onSelectTask: (task: LoraTask) => void;
}

export const LoraTaskCard: React.FC<LoraTaskCardProps> = ({ task, onSelectTask }) => {
  return (
    <GlassCard variant={task.requiresColdChain ? 'outlined' : 'filled'} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400">#{task.id}</span>
        <GlassBadge
          variant={task.status === 'DELIVERED' ? 'delivered' : 'pending'}
          label={task.status}
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-white">{task.targetFacilityName}</h3>
        <p className="text-xs text-gray-400">{task.targetAddress}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[hsla(210,100%,75%,0.1)] pt-2 text-xs">
        <span className="font-medium text-[hsl(174,100%,41%)]">
          Obat: {task.medicineName} ({task.quantity} unit)
        </span>
        {task.requiresColdChain && (
          <span className="rounded-full bg-[hsl(346,80%,18%)] px-2.5 py-0.5 text-xs text-[hsl(346,100%,80%)] border border-[hsl(346,84%,61%,0.3)]">
            Cold-Chain (2-8°C)
          </span>
        )}
        {task.isHardDrug && (
          <span className="rounded-full bg-[hsl(38,90%,18%)] px-2.5 py-0.5 text-xs text-[hsl(38,100%,80%)] border border-[hsl(38,92%,50%,0.3)]">
            Obat Keras (Escort Apt)
          </span>
        )}
      </div>

      <button
        onClick={() => onSelectTask(task)}
        className="mt-1 w-full rounded-full bg-[hsl(174,100%,41%)] py-2.5 text-xs font-bold text-gray-950 transition hover:bg-[hsl(174,100%,48%)]"
      >
        Buka Tugas & Proof of Delivery (M3)
      </button>
    </GlassCard>
  );
};
