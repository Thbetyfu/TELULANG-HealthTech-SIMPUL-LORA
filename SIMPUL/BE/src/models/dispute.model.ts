export interface DisputeReportEntity {
  id: string;
  puskesmasName: string;
  provinceName?: string;
  disputeNotes: string;
  status: 'PENDING_INSPECTION' | 'VERIFIED' | 'RESOLVED';
  createdAt: string;
}
