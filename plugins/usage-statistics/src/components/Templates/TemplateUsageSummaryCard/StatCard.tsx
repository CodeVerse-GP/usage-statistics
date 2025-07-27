import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { grey } from '@material-ui/core/colors';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: JSX.Element;
  color?: string;
  description?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  color,
  description,
}: StatCardProps) => (
  <Card variant="outlined" style={{ height: '100%' }}>
    <CardContent>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>{icon}</Grid>
        <Grid item>
          <Typography variant="subtitle2" color="textSecondary">
            {label}
          </Typography>
          <Typography variant="h6" style={{ color: color ?? grey[900] }}>
            {value}
          </Typography>
          {description && (
            <Typography variant="caption" color="textSecondary">
              {description}
            </Typography>
          )}
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
