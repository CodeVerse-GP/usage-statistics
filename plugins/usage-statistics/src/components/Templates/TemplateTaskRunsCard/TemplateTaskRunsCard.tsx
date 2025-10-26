import {
  InfoCard,
  Progress,
  Table,
  type TableColumn,
  StatusOK,
  StatusError,
  Link,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useTemplateTaskRuns } from '../../../hooks/useTemplateTaskRuns';
import { DateTime } from 'luxon';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { TaskRun } from '../../../types';

export const TemplateTaskRunsCard = () => {
  const { entity } = useEntity();
  const templateName = entity.metadata.name;
  const { taskRuns, loading, error } = useTemplateTaskRuns(templateName);
  const config = useApi(configApiRef);
  const backendUrl = config.getOptionalString('app.baseUrl');
  if (!backendUrl) {
    throw new Error('app.baseUrl is not configured in Backstage config.');
  }
  if (loading) return <Progress />;
  if (error) {
    return (
      <InfoCard title="Template Task Runs">
        <Alert severity="info">No task runs found for this template.</Alert>
      </InfoCard>
    );
  }
  if (!taskRuns || taskRuns.length === 0) {
    return (
      <InfoCard title="Template Task Runs">
        <Alert severity="info">No task runs found for this template.</Alert>
      </InfoCard>
    );
  }
  const columns: TableColumn<TaskRun>[] = [
    {
      title: 'ID',
      field: 'id',
      render: (row: TaskRun) => {
        const taskUrl = `${backendUrl}/create/tasks/${row.id}`;
        return <Link to={taskUrl}>{row.id}</Link>;
      },
    },
    {
      title: 'Status',
      field: 'status',
      render: (row: TaskRun) => {
        if (row.status === 'completed') {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusOK />
              <span>completed</span>
            </div>
          );
        }
        if (row.status === 'failed') {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusError />
              <span>failed</span>
            </div>
          );
        }
        return row.status;
      },
    },
    {
      title: 'Created At',
      field: 'created_at',
      render: (row: TaskRun) =>
        DateTime.fromISO(row.created_at).toLocaleString(
          DateTime.DATETIME_SHORT,
        ),
    },
    {
      title: 'Duration',
      field: 'duration',
      render: (row: TaskRun) => {
        if (row.status === 'failed') {
          return <StatusError />;
        }

        if (!row.created_at || !row.last_heartbeat_at) {
          return 'N/A';
        }

        const start = new Date(row.created_at).getTime();
        const end = new Date(row.last_heartbeat_at).getTime();
        const durationMs = end - start;

        if (durationMs <= 0) {
          return 'N/A';
        }

        const minutes = Math.floor(durationMs / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

        if (minutes > 0) {
          return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
      },
    },
    {
      title: 'Created By',
      field: 'created_by',
      render: (row: TaskRun) => {
        if (!row.created_by) return 'N/A';

        // Parse user:development/guest format
        const userMatch = row.created_by.match(/^user:(.+)\/(.+)$/);
        if (userMatch) {
          const [, namespace, username] = userMatch;
          const userUrl = `${backendUrl}/catalog/${namespace}/user/${username}`;
          return (
            <Link to={userUrl}>
              user:{namespace}/{username}
            </Link>
          );
        }

        // Fallback for other formats
        return row.created_by;
      },
    },
  ];
  return (
    <InfoCard title="Task Runs">
      <Table
        options={{ paging: true, search: true }}
        columns={columns}
        data={taskRuns}
      />
    </InfoCard>
  );
};
