import { TaskRun } from '../../../types';

/**
 * Calculate average run duration from successful task runs only
 */
export const calculateAvgDuration = (taskRuns: TaskRun[]): string => {
  const durations = taskRuns
    .filter(t => t.status === 'completed')
    .filter(t => t.created_at && t.last_heartbeat_at)
    .map(t => {
      const start = new Date(t.created_at).getTime();
      const end = new Date(t.last_heartbeat_at).getTime();
      return end - start;
    })
    .filter(duration => duration > 0);

  if (durations.length === 0) return 'N/A';

  const avgMs =
    durations.reduce((sum, duration) => sum + duration, 0) / durations.length;

  const minutes = Math.floor(avgMs / (1000 * 60));
  const seconds = Math.floor((avgMs % (1000 * 60)) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Calculate basic template usage statistics
 */
export const calculateUsageStats = (taskRuns: TaskRun[]) => {
  const totalRuns = taskRuns.length;
  const successCount = taskRuns.filter(t => t.status === 'completed').length;
  const failedCount = taskRuns.filter(t => t.status === 'failed').length;
  const processingCount = taskRuns.filter(t => t.status === 'processing').length;
  const openCount = taskRuns.filter(t => t.status === 'open').length;
  const cancelledCount = taskRuns.filter(t => t.status === 'cancelled').length;
  const skippedCount = taskRuns.filter(t => t.status === 'skipped').length;
  
  const successRate =
    totalRuns > 0 ? ((successCount / totalRuns) * 100).toFixed(2) : '0.00';
  const avgDuration = calculateAvgDuration(taskRuns);

  return {
    totalRuns,
    successCount,
    failedCount,
    processingCount,
    openCount,
    cancelledCount,
    skippedCount,
    successRate,
    avgDuration,
  };
};
