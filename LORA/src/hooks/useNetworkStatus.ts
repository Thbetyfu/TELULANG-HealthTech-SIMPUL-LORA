import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/db.service';
import { apiUrl } from '../../../web/src/config/api';

export interface NetworkStatus {
  isOnline: boolean;
  queuedOfflineCount: number;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  syncOfflineQueue: () => Promise<void>;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedOfflineCount, setQueuedOfflineCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Refresh count of items waiting in Dexie offlinePodQueue
  const refreshQueueCount = useCallback(async () => {
    try {
      const count = await db.offlinePodQueue.count();
      setQueuedOfflineCount(count);
    } catch (_err) {
      // Dexie count silent fallback
    }
  }, []);

  // Flush offline PoD items to backend API
  const syncOfflineQueue = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);

    try {
      const pendingItems = await db.offlinePodQueue.toArray();
      if (pendingItems.length > 0) {
        for (const item of pendingItems) {
          try {
            const response = await fetch(apiUrl('/api/v1/lora/pod'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                taskId: item.taskId,
                latitude: item.latitude,
                longitude: item.longitude,
                signatureTte: item.signatureBase64 || 'tte-signature-placeholder-min-10'
              })
            });

            if (response.ok || response.status === 201) {
              if (item.id) {
                await db.offlinePodQueue.delete(item.id);
              }
            }
          } catch (_err) {
            // Keep in queue for next sync attempt
          }
        }
        setLastSyncedAt(new Date().toLocaleTimeString());
      }
    } finally {
      setIsSyncing(false);
      await refreshQueueCount();
    }
  }, [isSyncing, refreshQueueCount]);

  useEffect(() => {
    refreshQueueCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic queue check every 10 seconds
    const interval = setInterval(() => {
      refreshQueueCount();
      if (navigator.onLine && queuedOfflineCount > 0) {
        syncOfflineQueue();
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [refreshQueueCount, syncOfflineQueue, queuedOfflineCount]);

  return {
    isOnline,
    queuedOfflineCount,
    isSyncing,
    lastSyncedAt,
    syncOfflineQueue
  };
};
