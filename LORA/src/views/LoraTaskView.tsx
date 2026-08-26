import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Thermometer, 
  ShieldCheck, 
  Package, 
  ArrowRight,
  Upload,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Database
} from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { db } from '../services/db.service';
import { apiUrl } from '../../../web/src/config/api';

interface DeliveryTask {
  id: string;
  sourceFacilityName: string;
  targetFacilityName: string;
  targetAddress: string;
  medicineName: string;
  quantity: number;
  temperatureCelsius: number;
  gpsCoordinates: string;
  urgency: 'HIGH' | 'CRITICAL' | 'NORMAL';
  status: 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';
}

export const LoraTaskView: React.FC = () => {
  const { isOnline, queuedOfflineCount, isSyncing, syncOfflineQueue } = useNetworkStatus();

  const [tasks, setTasks] = useState<DeliveryTask[]>([
    {
      id: 'TASK-LORA-9901',
      sourceFacilityName: 'Dinas Kesehatan Kota Ambon',
      targetFacilityName: 'Pustu Desa Sukamaju',
      targetAddress: 'Kecamatan Kairatu, Seram Barat, Maluku',
      medicineName: 'Paracetamol Syrup 120mg/5ml & Amoxicillin',
      quantity: 500,
      temperatureCelsius: 4.2,
      gpsCoordinates: '3.654° S, 128.198° E',
      urgency: 'CRITICAL',
      status: 'IN_TRANSIT'
    },
    {
      id: 'TASK-LORA-9902',
      sourceFacilityName: 'RSUD Chasan Boesoirie Ternate',
      targetFacilityName: 'Puskesmas Labuha',
      targetAddress: 'Kabupaten Halmahera Selatan, Maluku Utara',
      medicineName: 'Insulin Human Recombinant 100IU',
      quantity: 200,
      temperatureCelsius: 3.8,
      gpsCoordinates: '0.789° N, 127.382° E',
      urgency: 'HIGH',
      status: 'ASSIGNED'
    }
  ]);

  const [activeModalTask, setActiveModalTask] = useState<DeliveryTask | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [tteSuccess, setTteSuccess] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);

  // Load stored local tasks from Dexie DB on mount
  useEffect(() => {
    const initLocalTasks = async () => {
      try {
        const stored = await db.tasks.toArray();
        if (stored && stored.length > 0) {
          setTasks(prev => 
            prev.map(t => {
              const matched = stored.find(s => s.id === t.id);
              return matched ? { ...t, status: matched.status as any } : t;
            })
          );
        }
      } catch (_e) {
        // Fallback
      }
    };
    initLocalTasks();
  }, []);

  const handleOpenTteModal = (task: DeliveryTask) => {
    setActiveModalTask(task);
    setRecipientName('');
    setHasSignature(false);
    setTteSuccess(false);
    setSavedOffline(false);
  };

  const handleConfirmTteDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalTask || !recipientName || !hasSignature) return;

    const podPayload = {
      taskId: activeModalTask.id,
      courierId: 'KURIR-LORA-3TP-01',
      latitude: -3.654,
      longitude: 128.198,
      photoBase64: 'data:image/jpeg;base64,sample_photo_pod',
      signatureBase64: 'data:image/png;base64,sample_tte_signature',
      coldChainTempCelsius: activeModalTask.temperatureCelsius,
      escortPharmacistSip: 'SIP-APOTEKER-99120',
      deliveredAt: new Date().toISOString()
    };

    if (!isOnline) {
      // Save directly to Dexie IndexedDB offline queue
      await db.offlinePodQueue.add(podPayload);
      await db.tasks.put({
        id: activeModalTask.id,
        sourceFacilityName: activeModalTask.sourceFacilityName,
        targetFacilityName: activeModalTask.targetFacilityName,
        targetAddress: activeModalTask.targetAddress,
        medicineName: activeModalTask.medicineName,
        quantity: activeModalTask.quantity,
        requiresColdChain: true,
        isHardDrug: false,
        status: 'DELIVERED',
        estimatedMinutes: 45,
        createdAt: new Date().toISOString()
      });
      setSavedOffline(true);
    } else {
      // Direct API upload
      try {
        await fetch(apiUrl('/api/v1/lora/pod'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: podPayload.taskId,
            latitude: podPayload.latitude,
            longitude: podPayload.longitude,
            signatureTte: podPayload.signatureBase64 || 'tte-signature-placeholder-min-10'
          })
        });
      } catch (_err) {
        // Backup to Dexie queue if API request fails
        await db.offlinePodQueue.add(podPayload);
        setSavedOffline(true);
      }
    }

    setTteSuccess(true);
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === activeModalTask.id ? { ...t, status: 'DELIVERED' } : t));
      setActiveModalTask(null);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[hsl(230,25%,8%)] text-gray-100 font-sans pb-16 selection:bg-[hsl(172,85%,45%)] selection:text-black">
      {/* Sensor & Network PWA Banner */}
      <div className="border-b border-white/[0.08] bg-[hsl(230,20%,14%)] px-4 sm:px-8 py-3 shadow-md backdrop-blur-md">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-gray-300">
              <MapPin className="w-4 h-4 text-[hsl(172,85%,45%)]" />
              <span>3.654° S, 128.198° E (Wilayah 3TP)</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>Cold-Chain: 4.2°C</span>
            </span>
          </div>

          {/* Network Status Badge */}
          <div className="flex items-center gap-3">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/30">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Online (Terhubung Cloud)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3.5 py-1 text-xs font-extrabold text-rose-300 border border-rose-500/40 animate-pulse">
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Mode Luring 3TP (Offline)</span>
              </span>
            )}

            {queuedOfflineCount > 0 && (
              <button
                onClick={syncOfflineQueue}
                disabled={!isOnline || isSyncing}
                className="flex items-center gap-1.5 rounded-full bg-[hsl(172,85%,45%)] px-3.5 py-1 text-xs font-black text-gray-950 hover:scale-105 active:scale-95 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync {queuedOfflineCount} Offline Task</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Queue Container */}
      <main className="mx-auto max-w-4xl px-4 sm:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between rounded-[24px] border border-white/[0.08] bg-[hsl(230,20%,14%)] p-5 shadow-2xl">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-[hsl(172,85%,45%)]" />
              <span>LORA Courier Field Dispatch Queue</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Dukungan Pengiriman Logistik Obat Esensial Daerah Terdepan & Terluar</p>
          </div>
          <span className="rounded-full bg-[hsl(172,75%,14%)] px-4 py-1.5 text-xs font-extrabold text-[hsl(172,90%,82%)] border border-[hsl(172,85%,45%,0.3)]">
            {tasks.filter(t => t.status !== 'DELIVERED').length} Active Delivery Tasks
          </span>
        </div>

        {/* M3 Task Cards List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="rounded-[28px] bg-[hsl(230,20%,14%)] border border-white/[0.08] overflow-hidden hover:border-[hsl(172,85%,45%,0.4)] transition-all shadow-2xl">
              
              {/* Task Header Image */}
              <div className="relative h-32 w-full bg-[hsl(230,25%,8%)] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80" 
                  alt="Medicine Delivery"
                  className="w-full h-full object-cover opacity-35" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,20%,14%)] to-transparent" />
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-[hsl(230,25%,8%)] border border-white/[0.1] px-3 py-1 rounded-full text-white">
                    {task.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    task.urgency === 'CRITICAL' 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    Prioritas {task.urgency}
                  </span>
                </div>
              </div>

              {/* Task Details Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white">{task.medicineName}</h3>
                  <p className="text-xs text-gray-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{task.targetAddress}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Jumlah Paket</span>
                    <span className="font-mono font-black text-white text-sm">{task.quantity} Unit</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Target Faskes Tujuan</span>
                    <span className="font-bold text-[hsl(172,85%,45%)] truncate block text-sm">{task.targetFacilityName}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {task.status === 'DELIVERED' ? (
                    <div className="w-full py-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Proof of Delivery (PoD) & Canvas TTE Terverifikasi</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenTteModal(task)}
                      className="w-full py-3.5 rounded-full bg-[hsl(172,85%,45%)] hover:bg-[hsl(172,90%,50%)] text-gray-950 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Input Proof of Delivery (PoD) & TTE Digital</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* M3 TTE Digital Signature Modal */}
      {activeModalTask && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[hsl(230,20%,14%)] border border-white/[0.1] rounded-[28px] p-6 sm:p-7 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[hsl(172,85%,45%)]" />
                <span>Verifikasi PoD & TTE Digital</span>
              </h3>
              <button 
                onClick={() => setActiveModalTask(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-white">
                  {savedOffline ? 'TTE Tersimpan di IndexedDB (Mode Luring)' : 'TTE Berhasil Diverifikasi & Diunggah!'}
                </h4>
                <p className="text-xs text-gray-300 font-mono">
                  {savedOffline
                    ? 'Akan di-sync otomatis ke SATUSEHAT Cloud saat sinyal internet kembali.'
                    : 'SATUSEHAT FHIR API Transaction Hash Generated.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmTteDelivery} className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-white block mb-1.5">Nama Penerima Faskes / Apoteker</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ketik nama penerima obat..."
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-[hsl(230,25%,8%)] border border-white/[0.1] focus:border-[hsl(172,85%,45%)] rounded-[16px] p-3 text-xs text-white outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-white block mb-1.5">Canvas Tanda Tangan Digital (TTE)</label>
                  <div 
                    onClick={() => setHasSignature(true)}
                    className={`h-32 rounded-[20px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      hasSignature 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/[0.15] bg-[hsl(230,25%,8%)] hover:border-[hsl(172,85%,45%)]'
                    }`}
                  >
                    {hasSignature ? (
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Tanda Tangan Digital Terkonfirmasi</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[hsl(172,85%,45%)]" />
                        <span>Ketuk di sini untuk tanda tangan TTE</span>
                      </span>
                    )}
                  </div>
                </div>

                {!isOnline && (
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-500/15 p-3 text-xs font-medium text-amber-200 border border-amber-500/30">
                    <Database className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Perangkat sedang offline. PoD akan disimpan ke storage lokal IndexedDB.</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!hasSignature || !recipientName}
                  className={`w-full py-3.5 rounded-full font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    hasSignature && recipientName 
                      ? 'bg-[hsl(172,85%,45%)] text-gray-950 hover:bg-[hsl(172,90%,50%)] shadow-lg active:scale-95' 
                      : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Kirim Proof of Delivery (PoD)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
