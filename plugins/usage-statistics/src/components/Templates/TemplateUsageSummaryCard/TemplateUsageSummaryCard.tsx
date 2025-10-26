import { InfoCard, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useTemplateTaskRuns } from '../../../hooks/useTemplateTaskRuns';
import Grid from '@material-ui/core/Grid';
import { green, red } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import TimelineIcon from '@material-ui/icons/Timeline';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { StatCard } from './StatCard';
import { calculateUsageStats } from './utils';

export const TemplateUsageSummaryCard = () => {
  const { entity } = useEntity();
  const templateName = entity.metadata.name;
  const { taskRuns, loading, error } = useTemplateTaskRuns(templateName);

  if (loading) {
    return <Progress />;
  }

  if (error || !taskRuns || !Array.isArray(taskRuns) || taskRuns.length === 0) {
    return (
      <InfoCard title="Usage Summary">
        <Alert severity="error">
          {error ? error.message : 'No task runs found for this template.'}
        </Alert>
      </InfoCard>
    );
  }

  const { totalRuns, successCount, failedCount, successRate, avgDuration } =
    calculateUsageStats(taskRuns);

  return (
    <InfoCard title="Usage Summary">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Runs"
            value={totalRuns}
            icon={<TimelineIcon color="action" />}
            description="Total number of times this template has been executed."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Successful Runs"
            value={successCount}
            icon={<CheckCircleIcon style={{ color: green[600] }} />}
            color={green[700]}
            description="Runs that finished successfully without any errors."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Failed Runs"
            value={failedCount}
            icon={<ErrorIcon style={{ color: red[600] }} />}
            color={red[700]}
            description="Runs that ended with errors or failed to complete."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Success Rate"
            value={`${successRate}%`}
            icon={<TrendingUpIcon color="primary" />}
            color={parseFloat(successRate) >= 80 ? green[700] : red[700]}
            description="Percentage of successful runs out of all template runs."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Avg Duration"
            value={avgDuration}
            icon={<AccessTimeIcon color="action" />}
            description="Average time taken for template runs to complete."
          />
        </Grid>
      </Grid>
    </InfoCard>
  );
};
