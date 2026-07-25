import { InfoCard } from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Skeleton from '@material-ui/lab/Skeleton';

const STAT_CARD_COUNT = 9;

export const UsageSummarySkeleton = () => (
  <InfoCard title="Usage Summary">
    <Grid container spacing={2}>
      {Array.from({ length: STAT_CARD_COUNT }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card variant="outlined" style={{ height: '100%' }}>
            <CardContent>
              <Grid container alignItems="center" spacing={1} wrap="nowrap">
                <Grid item>
                  <Skeleton variant="circle" width={24} height={24} />
                </Grid>
                <Grid item xs>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="text" width="90%" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </InfoCard>
);
