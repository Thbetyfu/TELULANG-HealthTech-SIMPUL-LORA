import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface StockUpdateEventPayload {
  event: 'STOCK_UPDATED' | 'DISCREPANCY_ALERT' | 'LORA_TASK_ASSIGNED';
  facilityId: string;
  facilityName: string;
  kfaCode: string;
  medicineName: string;
  newStockQty: number;
  discrepancyPct?: number;
  timestamp: string;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(httpServer: HttpServer): void {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:4173',
          'http://localhost:3000',
          'https://simpul-lora.vercel.app',
          '*'
        ],
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SIMPUL WebSocket]: Client connected - ${socket.id}`);

      // Demo: emit one seeded discrepancy alert shortly after connect (real Socket.IO path)
      const demoTimer = setTimeout(() => {
        this.broadcastStockUpdate({
          event: 'DISCREPANCY_ALERT',
          facilityId: 'FAS-8101-01',
          facilityName: 'Puskesmas Kairatu Seram Barat',
          kfaCode: '93000124',
          medicineName: 'Paracetamol Syrup 120mg/5ml',
          newStockQty: 120,
          discrepancyPct: 24.1,
          timestamp: new Date().toISOString()
        });
      }, 3500);

      socket.on('disconnect', () => {
        clearTimeout(demoTimer);
        console.log(`[SIMPUL WebSocket]: Client disconnected - ${socket.id}`);
      });
    });
  }

  public broadcastStockUpdate(payload: StockUpdateEventPayload): void {
    if (this.io) {
      this.io.emit('stock_event', payload);
      console.log(`[SIMPUL WebSocket Broadcast]: Event ${payload.event} sent for ${payload.facilityName}`);
    }
  }
}
