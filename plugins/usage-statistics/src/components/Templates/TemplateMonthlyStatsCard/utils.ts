import { MonthlyStat } from '../../../types';
/**
 * Fills missing months with zero data for a complete timeline
 * For current year, only shows up to current month
 * For past years, shows all 12 months
 */
export const fillMissingMonths = (
  stats: MonthlyStat[],
  year: string
): MonthlyStat[] => {
  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];
  const result: MonthlyStat[] = [];
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = new Date().getMonth() + 1;
  const monthsToShow = year === currentYear ? months.slice(0, currentMonth) : months;
  for (const month of monthsToShow) {
    const monthKey = `${year}-${month}`;
    const existingData = stats.find(stat => stat.month === monthKey);
    if (existingData) {
      result.push(existingData);
    } else {
      result.push({ month: monthKey, total: 0, success: 0, failed: 0, successRate: '0' });
    }
  }
  return result;
};

/**
 * Extracts unique years from monthly statistics data
 * Returns years in descending order (newest first)
 */
export const extractYearsFromStats = (stats: MonthlyStat[]): string[] => {
  return Array.from(
    new Set(stats.map(stat => stat.month.slice(0, 4))),
  )
    .sort()
    .reverse();
};

/**
 * Filters statistics by year and fills missing months
 */
export const getFilteredStatsForYear = (
  allStats: MonthlyStat[],
  selectedYear: string
): MonthlyStat[] => {
  if (!selectedYear) return [];
  const yearStats = allStats.filter(stat => stat.month.startsWith(selectedYear));
  return fillMissingMonths(yearStats, selectedYear);
};
