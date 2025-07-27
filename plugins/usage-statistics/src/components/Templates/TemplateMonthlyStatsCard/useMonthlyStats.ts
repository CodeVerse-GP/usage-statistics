import { useState, useEffect } from 'react';
import { useMonthlyStatsByTemplateName } from '../../../hooks/useTemplateTaskRuns';
import { extractYearsFromStats, getFilteredStatsForYear } from './utils';
import { MonthlyStat } from '../../../types';

interface UseMonthlyStatsResult {
  filteredStats: MonthlyStat[];
  years: string[];
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  loading: boolean;
  error: any;
  hasInitialized: boolean;
}

export const useMonthlyStats = (templateName: string): UseMonthlyStatsResult => {
  const { monthlyStats, loading, error } = useMonthlyStatsByTemplateName(templateName);

  const allStats = (monthlyStats || []) as MonthlyStat[];
  const years = extractYearsFromStats(allStats);
  
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!hasInitialized && years.length > 0) {
      setSelectedYear(years[0]);
      setHasInitialized(true);
    }
  }, [years, hasInitialized]);

  const filteredStats = getFilteredStatsForYear(allStats, selectedYear);

  return {
    filteredStats,
    years,
    selectedYear,
    setSelectedYear,
    loading,
    error,
    hasInitialized,
  };
};
