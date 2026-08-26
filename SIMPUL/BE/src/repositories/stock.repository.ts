import { StockEntity, DiscrepancyAuditEntity, PublicFacilityMapEntity } from '../models/stock.model';

export class StockRepository {
  // In-Memory fallback store for initial setup until Prisma DB connection string is initialized
  private stocks: Map<string, StockEntity> = new Map();
  private audits: Map<string, DiscrepancyAuditEntity> = new Map();
  private publicFacilities: PublicFacilityMapEntity[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const initialStocks: StockEntity[] = [
      {
        id: 'STK-001',
        facilityId: 'FAS-3204-01',
        kfaCode: '93000122',
        medicineName: 'Oksitosin Injeksi 10 UI/mL',
        stockQty: 110,
        bufferThreshold: 50,
        expirationDate: new Date('2027-12-31'),
        lastSyncedAt: new Date()
      },
      {
        id: 'STK-002',
        facilityId: 'FAS-3204-02',
        kfaCode: '93000124',
        medicineName: 'OAT Lini 2 (MDR-TB)',
        stockQty: 0,
        bufferThreshold: 25,
        expirationDate: new Date('2027-06-30'),
        lastSyncedAt: new Date()
      },
      {
        id: 'STK-003',
        facilityId: 'FAS-8101-01',
        kfaCode: '93000122',
        medicineName: 'Oksitosin Injeksi 10 UI/mL',
        stockQty: 0,
        bufferThreshold: 40,
        expirationDate: new Date('2027-10-15'),
        lastSyncedAt: new Date()
      },
      {
        id: 'STK-004',
        facilityId: 'FAS-9201-01',
        kfaCode: '93000125',
        medicineName: 'Insulin Human Injeksi 100 IU',
        stockQty: 12,
        bufferThreshold: 60,
        expirationDate: new Date('2027-08-20'),
        lastSyncedAt: new Date()
      }
    ];

    for (const stk of initialStocks) {
      this.stocks.set(stk.id, stk);
    }

    const initialAudit: DiscrepancyAuditEntity = {
      id: 'AUD-9910',
      stockId: 'STK-001',
      reportedSystemQty: 160,
      actualPhysicalQty: 110,
      discrepancyPct: 15.5,
      status: 'OPEN',
      flaggedAt: new Date()
    };

    this.audits.set(initialAudit.id, initialAudit);

    this.publicFacilities = [
      {
        id: 'STK-001',
        facilityName: 'RSUD Halmahera Selatan',
        provinceName: 'Maluku Utara',
        cityName: 'Labuha',
        medicineName: 'Amoxicillin 500mg (Tab)',
        availableStock: 450,
        temperatureCelsius: 4.2,
        status: 'MENIPIS',
        lat: -0.6402,
        lng: 127.4801
      },
      {
        id: 'STK-002',
        facilityName: 'Puskesmas Kairatu',
        provinceName: 'Maluku',
        cityName: 'Seram Barat',
        medicineName: 'Paracetamol Syrup 120mg/5ml',
        availableStock: 1200,
        temperatureCelsius: 4.5,
        status: 'TERSEDIA',
        lat: -3.3512,
        lng: 128.3614
      },
      {
        id: 'STK-003',
        facilityName: 'RSUD Jayapura',
        provinceName: 'Papua',
        cityName: 'Jayapura',
        medicineName: 'Insulin Human Recombinant 100IU',
        availableStock: 0,
        temperatureCelsius: 2.1,
        status: 'KOSONG',
        lat: -2.5337,
        lng: 140.7181
      },
      {
        id: 'STK-004',
        facilityName: 'Puskesmas Tarakan Barat',
        provinceName: 'Kalimantan Utara',
        cityName: 'Tarakan',
        medicineName: 'Oralit Garam Dehidrasi',
        availableStock: 3400,
        temperatureCelsius: 5.0,
        status: 'TERSEDIA',
        lat: 3.3082,
        lng: 117.5910
      },
      {
        id: 'STK-005',
        facilityName: 'RSUD M. Yunus',
        provinceName: 'Bengkulu',
        cityName: 'Bengkulu Kota',
        medicineName: 'Cefadroxil 500mg',
        availableStock: 2100,
        temperatureCelsius: 4.8,
        status: 'TERSEDIA',
        lat: -3.8242,
        lng: 102.2894
      },
      {
        id: 'STK-006',
        facilityName: 'Dinkes Kota Ambon',
        provinceName: 'Maluku',
        cityName: 'Kota Ambon',
        medicineName: 'Vaksin TT & Serum Anti Bisa',
        availableStock: 520,
        temperatureCelsius: 3.5,
        status: 'MENIPIS',
        lat: -3.6954,
        lng: 128.1814
      },
      {
        id: 'STK-007',
        facilityName: 'RSUD Chasan Boesoirie',
        provinceName: 'Maluku Utara',
        cityName: 'Ternate',
        medicineName: 'Metformin 500mg',
        availableStock: 1800,
        temperatureCelsius: 4.0,
        status: 'TERSEDIA',
        lat: 0.7892,
        lng: 127.3820
      }
    ];
  }

  async getPublicMapFacilities(): Promise<PublicFacilityMapEntity[]> {
    return this.publicFacilities;
  }

  async findByFacilityAndKfa(facilityId: string, kfaCode: string): Promise<StockEntity | null> {
    for (const stock of this.stocks.values()) {
      if (stock.facilityId === facilityId && stock.kfaCode === kfaCode) {
        return stock;
      }
    }
    return null;
  }

  async saveStock(stock: StockEntity): Promise<StockEntity> {
    this.stocks.set(stock.id, stock);
    return stock;
  }

  async createDiscrepancyAudit(audit: DiscrepancyAuditEntity): Promise<DiscrepancyAuditEntity> {
    this.audits.set(audit.id, audit);
    return audit;
  }

  async findAllDiscrepancies(): Promise<DiscrepancyAuditEntity[]> {
    return Array.from(this.audits.values()).filter(a => a.status === 'OPEN');
  }
}

