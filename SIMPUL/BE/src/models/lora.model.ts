export interface LoraTaskEntity {
  id: string;
  sourceFacilityName: string;
  targetFacilityName: string;
  targetAddress: string;
  medicineName: string;
  quantity: number;
  requiresColdChain: boolean;
  isHardDrug: boolean;
  status: 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  estimatedMinutes: number;
  latitude?: number;
  longitude?: number;
  signatureTte?: string;
  podTimestamp?: string;
  createdAt: string;
}
