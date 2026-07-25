import { InfoCard } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

export const MonthlyStatsSkeleton = () => (
  <InfoCard title="Monthly Statistics">
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <Skeleton variant="rect" width={120} height={40} />
    </Box>
    <Skeleton variant="rect" width="100%" height={300} />
  </InfoCard>
);
