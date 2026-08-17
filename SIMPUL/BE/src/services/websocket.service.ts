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
        origin: ['http://localhost:3000', 'http://localhost:5173', 'https://simpul.kemkes.go.id'],
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SIMPUL WebSocket]: Client connected - ${socket.id}`);

      socket.on('disconnect', () => {
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
