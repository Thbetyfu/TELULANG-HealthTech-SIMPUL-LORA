import Dexie, { Table } from 'dexie';
import { LoraTask, ProofOfDeliveryPayload } from '../types/task.type';

export class LoraDatabase extends Dexie {
  tasks!: Table<LoraTask, string>;
  offlinePodQueue!: Table<ProofOfDeliveryPayload & { id?: number }, number>;

  constructor() {
    super('LoraFieldPwaDb');
    this.version(1).stores({
      tasks: 'id, status, requiresColdChain',
      offlinePodQueue: '++id, taskId, deliveredAt'
    });
  }
}

export const db = new LoraDatabase();
