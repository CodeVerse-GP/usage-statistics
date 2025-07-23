export interface TaskRun {
  id: string;
  status: string;
  created_at: string;
  last_heartbeat_at: string;
  created_by: string;
}

export interface MonthlyStat {
  month: string;
  total: number;
  success: number;
  failed: number;
  successRate: string;
}
