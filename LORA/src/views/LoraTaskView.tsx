import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { LoraTaskCard } from '../components/features/LoraTaskCard';
import { SignatureCanvas } from '../components/ui/SignatureCanvas';
import { LoraTask } from '../types/task.type';
import { Truck, MapPin, ArrowLeft, CheckCircle2, Send, Radio } from 'lucide-react';

export const LoraTaskView: React.FC = () => {
  const geo = useGeolocation();
  const [tasks, setTasks] = useState<LoraTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<LoraTask | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/lora/tasks');
      if (res.ok) {
        const json = await res.json();
        setTasks(json.data || []);
      }
    } catch (_e) {
      // fallback
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmitPoD = async () => {
    if (!signature) {
      alert('Tanda tangan digital penerima (TTE) wajib diisi.');
      return;
    }

    if (!selectedTask) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/v1/lora/pod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTask.id,
          latitude: geo.latitude,
          longitude: geo.longitude,
          signatureTte: signature
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengirim PoD ke server');
      }
      setSubmitted(true);
    } catch (err: any) {
      alert('Error pengiriman PoD: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(230,25%,8%)] p-4 sm:p-6 text-gray-100 font-sans max-w-2xl mx-auto selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* Mobile Top App Bar */}
      <header className="mb-6 flex items-center justify-between rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[hsl(172,85%,45%)] text-gray-950 font-black text-base shadow-md shadow-[hsl(172,85%,45%,0.2)]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              LORA Courier Mobile
            </h1>
            <p className="text-[11px] text-gray-400">Logistik Rakyat Field Courier App</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[hsl(230,25%,8%)] px-3 py-1 text-xs border border-white/[0.08]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">PWA Online</span>
        </div>
      </header>

      {/* Geolocation Status Bar */}
      <div className="mb-6 rounded-[20px] border border-cyan-500/20 bg-cyan-500/10 p-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="font-extrabold text-cyan-300">GPS Geolocation Locking:</span>
        </div>
        {geo.loading ? (
          <span className="text-gray-400">Mencari sinyal GPS satelit...</span>
        ) : geo.error ? (
          <span className="text-rose-400">{geo.error}</span>
        ) : (
          <div className="flex items-center gap-1.5 font-mono text-gray-200 mt-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{geo.latitude?.toFixed(6)}, {geo.longitude?.toFixed(6)} (Presisi ±{geo.accuracy?.toFixed(0)}m)</span>
          </div>
        )}
      </div>

      {!selectedTask ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white">Tugas Pengiriman Terjadwal ({tasks.length}):</h2>
            <span className="text-xs text-gray-400">Diperbarui Live</span>
          </div>
          {tasks.map(task => (
            <LoraTaskCard key={task.id} task={task} onSelectTask={setSelectedTask} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5 rounded-[28px] border border-white/[0.1] bg-[hsl(230,20%,14%)] p-6 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => { setSelectedTask(null); setSubmitted(false); }}
            className="flex items-center gap-2 self-start rounded-full bg-[hsl(230,25%,8%)] px-4 py-1.5 text-xs font-bold text-cyan-400 border border-white/[0.08] hover:border-cyan-400/40 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Tugas</span>
          </button>

          <div>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">#{selectedTask.id}</span>
            <h2 className="text-xl font-black text-white mt-2">Proof of Delivery (PoD)</h2>
            <p className="text-xs text-gray-300 mt-1">Faskes Penerima: <span className="font-bold text-emerald-300">{selectedTask.targetFacilityName}</span></p>
          </div>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 rounded-[20px] border border-emerald-500/30 bg-emerald-500/20 p-5 text-center text-xs font-bold text-emerald-300 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Proof of Delivery & TTE Digital berhasil terverifikasi dan di-sync ke Cloud PDN!</span>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <SignatureCanvas onSaveSignature={setSignature} />

              <button
                onClick={handleSubmitPoD}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[hsl(172,85%,45%)] py-3.5 text-xs font-black text-gray-950 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[hsl(172,85%,45%,0.2)]"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Mengunggah Proof of Delivery (PoD)...' : 'Kirim Proof of Delivery (PoD)'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
