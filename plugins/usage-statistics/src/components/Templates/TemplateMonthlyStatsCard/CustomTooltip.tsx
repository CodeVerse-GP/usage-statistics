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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month: string;
      success: number;
      failed: number;
      total: number;
      successRate: number;
    };
  }>;
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  const classes = useTooltipStyles();

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
