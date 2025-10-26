import { InfoCard, Progress } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import { useMonthlyStats } from './useMonthlyStats';
import { YearSelector } from './YearSelector';
import { MonthlyStatsChart } from './MonthlyStatsChart';

export const TemplateMonthlyStatsCard = () => {
  const { entity } = useEntity();
  const templateName = entity.metadata.name;

  const {
    filteredStats,
    years,
    selectedYear,
    setSelectedYear,
    loading,
    error,
    hasInitialized,
  } = useMonthlyStats(templateName);

  if (loading) return <Progress />;

  if (error) {
    const isNotFound =
      (error as any)?.status === 404 ||
      (error as any)?.message?.includes('404');
    return (
      <InfoCard title="Monthly Statistics">
        {isNotFound ? (
          <Alert severity="info">No monthly statistics found.</Alert>
        ) : (
          <Alert severity="error">
            Failed to load monthly statistics: {error.message}
          </Alert>
        )}
      </InfoCard>
    );
  }

  if (!hasInitialized && years.length > 0) {
    return <Progress />;
  }

  if (!filteredStats || filteredStats.length === 0) {
    return (
      <InfoCard title="Monthly Statistics">
        <Alert severity="info">No monthly statistics found.</Alert>
      </InfoCard>
    );
  }

  return (
    <InfoCard title="Monthly Statistics">
      <YearSelector
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <MonthlyStatsChart data={filteredStats} />
    </InfoCard>
  );
};
