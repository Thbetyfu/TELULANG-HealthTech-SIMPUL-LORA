import { StockRepository } from '../repositories/stock.repository';
import { WebSocketService } from './websocket.service';
import { SatusehatDispenseEventInput } from '../schemas/satusehat.schema';

export class SatusehatIngestionService {
  constructor(
    private stockRepository: StockRepository,
    private webSocketService: WebSocketService
  ) {}

  async processDispenseEvent(event: SatusehatDispenseEventInput): Promise<{
    remainingStock: number;
    discrepancyFlagged: boolean;
  }> {
    let stock = await this.stockRepository.findByFacilityAndKfa(
      event.facilitySatusehatCode,
      event.kfaCode
    );

    const initialStock = stock ? stock.stockQty : 200;
    const newStockQty = Math.max(0, initialStock - event.quantityDispensed);

    if (!stock) {
      stock = {
        id: 'stk-' + Date.now(),
        facilityId: event.facilitySatusehatCode,
        kfaCode: event.kfaCode,
        medicineName: event.medicineName || 'Obat Esensial KFA ' + event.kfaCode,
        stockQty: newStockQty,
        bufferThreshold: 50,
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        lastSyncedAt: new Date()
      };
    } else {
      stock.stockQty = newStockQty;
      stock.lastSyncedAt = new Date();
    }

    await this.stockRepository.saveStock(stock);

    const isLowBuffer = newStockQty < stock.bufferThreshold;

    // Broadcast WebSocket Event
    this.webSocketService.broadcastStockUpdate({
      event: isLowBuffer ? 'DISCREPANCY_ALERT' : 'STOCK_UPDATED',
      facilityId: event.facilitySatusehatCode,
      facilityName: event.facilityName || 'Puskesmas Bojongsoang',
      kfaCode: event.kfaCode,
      medicineName: stock.medicineName,
      newStockQty,
      discrepancyPct: isLowBuffer ? 15.5 : 0,
      timestamp: new Date().toISOString()
    });

    return {
      remainingStock: newStockQty,
      discrepancyFlagged: isLowBuffer
    };
  }
}
