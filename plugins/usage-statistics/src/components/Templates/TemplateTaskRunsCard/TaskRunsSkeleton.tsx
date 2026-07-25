import { InfoCard } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

const TAB_COUNT = 6;
const ROW_COUNT = 6;

export const TaskRunsSkeleton = () => (
  <InfoCard title="Task Runs" noPadding>
    <Box display="flex" px={2} py={1.5} style={{ gap: 16 }}>
      {Array.from({ length: TAB_COUNT }).map((_, index) => (
        <Skeleton key={index} variant="text" width={90} height={32} />
      ))}
    </Box>
    <Box px={2} pb={2}>
      <Skeleton variant="text" width="100%" height={48} />
      {Array.from({ length: ROW_COUNT }).map((_, index) => (
        <Skeleton key={index} variant="text" width="100%" height={40} />
      ))}
    </Box>
  </InfoCard>
);
