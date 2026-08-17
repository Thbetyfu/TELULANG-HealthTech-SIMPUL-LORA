export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

export interface LoraTask {
  id: string;
  sourceFacilityName: string;
  targetFacilityName: string;
  targetAddress: string;
  medicineName: string;
  quantity: number;
  requiresColdChain: boolean;
  isHardDrug: boolean;
  status: TaskStatus;
  estimatedMinutes: number;
  createdAt: string;
}

export interface ProofOfDeliveryPayload {
  taskId: string;
  courierId: string;
  latitude: number;
  longitude: number;
  photoBase64: string;
  signatureBase64: string;
  coldChainTempCelsius?: number;
  escortPharmacistSip?: string;
  deliveredAt: string;
}
