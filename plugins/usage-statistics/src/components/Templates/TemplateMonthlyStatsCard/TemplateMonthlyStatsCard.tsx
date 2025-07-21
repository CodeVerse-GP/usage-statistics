import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMonthlyStatsByTemplateName } from '../../../hooks/useTemplateTaskRuns';
import { InfoCard, Progress } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import Alert from '@material-ui/lab/Alert';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useTooltipStyles = makeStyles(theme => ({
  tooltip: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: '10px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    fontSize: '0.875rem',
    maxWidth: 200,
  },
}));

export const CustomTooltip = (props: any) => {
  const classes = useTooltipStyles();

  const { active, payload, label } = props;

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className={classes.tooltip}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <div>✅ Success: {data.success}</div>
      <div>❌ Failed: {data.failed}</div>
      <div>📊 Total: {data.total}</div>
      <div>📈 Success Rate: {data.successRate}%</div>
    </div>
  );
};

export const TemplateMonthlyStatsCard = () => {
  const { entity } = useEntity();
  const templateName = entity.metadata.name;
  const { monthlyStats, loading, error } =
    useMonthlyStatsByTemplateName(templateName);

  const allStats = monthlyStats || [];
  const currentYear = new Date().getFullYear().toString();
  const years = Array.from(
    new Set(allStats.map(stat => stat.month.slice(0, 4))),
  )
    .sort()
    .reverse();

  const initialYear = years.includes(currentYear)
    ? currentYear
    : years[0] || currentYear;
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);

  const filteredStats = allStats.filter(stat =>
    stat.month.startsWith(selectedYear),
  );
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
  if (!filteredStats || filteredStats.length === 0) {
    return (
      <InfoCard title="Monthly Statistics">
        <Alert severity="info">No monthly statistics found.</Alert>
      </InfoCard>
    );
  }

  return (
    <InfoCard title="Monthly Statistics">
      <FormControl variant="outlined" size="small">
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value as string)}
          label="Year"
        >
          {years.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={filteredStats}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="success" fill="#4caf50" name="Success" />
          <Bar dataKey="failed" fill="#f44336" name="Failed" />
          <Bar dataKey="total" fill="#8884d8" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </InfoCard>
  );
};
