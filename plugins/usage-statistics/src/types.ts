export type TaskStatus = 'cancelled' | 'completed' | 'failed' | 'open' | 'processing' | 'skipped';

export interface TaskRun {
  id: string;
  status: TaskStatus;
  created_at: string;
  last_heartbeat_at: string;
  created_by: string;
}

export interface MonthlyStat {
  month: string;
  total: number;
  success: number;
  failed: number;
  processing: number;
  open: number;
  cancelled: number;
  skipped: number;
  successRate: string;
}
