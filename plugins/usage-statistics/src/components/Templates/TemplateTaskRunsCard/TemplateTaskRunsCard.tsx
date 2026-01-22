import { useMemo, useState, type ReactNode } from 'react';
import {
  InfoCard,
  Progress,
  Table,
  type TableColumn,
  StatusOK,
  StatusError,
  StatusPending,
  StatusAborted,
  Link,
} from '@backstage/core-components';
import { Tabs, Tab, Box } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useTemplateTaskRuns } from '../../../hooks/useTemplateTaskRuns';
import { DateTime } from 'luxon';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { TaskRun } from '../../../types';

type StatusTab = 'all' | 'completed' | 'failed' | 'processing' | 'skipped' | 'cancelled';

const STATUS_TABS: StatusTab[] = ['all', 'completed', 'failed', 'processing', 'skipped', 'cancelled'];

const STATUS_CONFIG: Record<string, { icon: ReactNode; label: string }> = {
  completed: { icon: <StatusOK />, label: 'completed' },
  failed: { icon: <StatusError />, label: 'failed' },
  processing: { icon: <StatusPending />, label: 'processing' },
  skipped: { icon: <StatusAborted />, label: 'skipped' },
  cancelled: { icon: <StatusAborted />, label: 'cancelled' },
};

const StatusCell = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return <>{status}</>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

const formatDuration = (durationMs: number): string => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

export const TemplateTaskRunsCard = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const { entity } = useEntity();
  const { taskRuns, loading, error } = useTemplateTaskRuns(entity.metadata.name);
  const config = useApi(configApiRef);
  const backendUrl = config.getOptionalString('app.baseUrl');

  const { filteredTaskRuns, statusCounts } = useMemo(() => {
    if (!taskRuns) {
      return {
        filteredTaskRuns: [],
        statusCounts: { all: 0, completed: 0, failed: 0, processing: 0, skipped: 0, cancelled: 0 },
      };
    }
    const counts = taskRuns.reduce(
      (acc, run) => {
        acc.all++;
        if (run.status in acc) acc[run.status as StatusTab]++;
        return acc;
      },
      { all: 0, completed: 0, failed: 0, processing: 0, skipped: 0, cancelled: 0 },
    );
    return {
      filteredTaskRuns: activeTab === 'all' ? taskRuns : taskRuns.filter(r => r.status === activeTab),
      statusCounts: counts,
    };
  }, [taskRuns, activeTab]);

  const columns: TableColumn<TaskRun>[] = useMemo(
    () => [
      {
        title: 'ID',
        field: 'id',
        render: (row: TaskRun) => (
          <Link to={`${backendUrl}/create/tasks/${row.id}`}>{row.id}</Link>
        ),
      },
      {
        title: 'Status',
        field: 'status',
        render: (row: TaskRun) => <StatusCell status={row.status} />,
      },
      {
        title: 'Created At',
        field: 'created_at',
        render: (row: TaskRun) =>
          DateTime.fromISO(row.created_at).toLocaleString(DateTime.DATETIME_SHORT),
      },
      {
        title: 'Duration',
        field: 'duration',
        render: (row: TaskRun) => {
          if (row.status === 'failed') return <StatusError />;
          if (!row.created_at || !row.last_heartbeat_at) return 'N/A';
          const durationMs = new Date(row.last_heartbeat_at).getTime() - new Date(row.created_at).getTime();
          return durationMs > 0 ? formatDuration(durationMs) : 'N/A';
        },
      },
      {
        title: 'Created By',
        field: 'created_by',
        render: (row: TaskRun) => {
          if (!row.created_by) return 'N/A';
          const match = row.created_by.match(/^user:(.+)\/(.+)$/);
          if (match) {
            const [, namespace, username] = match;
            return <Link to={`${backendUrl}/catalog/${namespace}/user/${username}`}>{row.created_by}</Link>;
          }
          return row.created_by;
        },
      },
    ],
    [backendUrl],
  );

  if (!backendUrl) {
    throw new Error('app.baseUrl is not configured in Backstage config.');
  }
  if (loading) return <Progress />;
  if (error || !taskRuns?.length) {
    return (
      <InfoCard title="Task Runs">
        <Alert severity="info">No task runs found for this template.</Alert>
      </InfoCard>
    );
  }

  return (
    <InfoCard title="Task Runs" noPadding>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value as StatusTab)}
        indicatorColor="primary"
        textColor="primary"
        style={{ paddingLeft: 16 }}
      >
        {STATUS_TABS.map(tab => (
          <Tab
            key={tab}
            value={tab}
            label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} (${statusCounts[tab]})`}
          />
        ))}
      </Tabs>
      <Box>
        <Table
          options={{ paging: true, search: false, toolbar: false }}
          columns={columns}
          data={filteredTaskRuns}
        />
      </Box>
    </InfoCard>
  );
};
