import {
  createFrontendPlugin,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { convertLegacyRouteRefs } from '@backstage/core-compat-api';
import { rootRouteRef } from './routes';
import { usageStatisticsApiRef, UsageStatisticsClient } from './api';
import {
  discoveryApiRef,
  fetchApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/core-plugin-api';

/**
 * An API to communicate with the Usage Statistics backend.
 *
 * @alpha
 */
const usageStatisticsApi = ApiBlueprint.make({
  name: 'usageStatisticsApi',
  params: defineParams =>
    defineParams({
      api: usageStatisticsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({
        discoveryApi,
        fetchApi,
      }: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
      }) =>
        new UsageStatisticsClient({
          discoveryApi,
          fetchApi,
        }),
    }),
});

/**
 * Template Usage Summary Card component extension.
 *
 * @alpha
 */
export const templateUsageSummaryCard = EntityContentBlueprint.make({
  name: 'templateUsageSummaryCard',
  params: {
    path: 'usage-summary',
    title: 'Usage Summary',
    loader: () =>
      import('./components/Templates/TemplateUsageSummaryCard').then(m => (
        <m.TemplateUsageSummaryCard />
      )),
  },
});

/**
 * Template Monthly Stats Card component extension.
 *
 * @alpha
 */
export const templateMonthlyStatsCard = EntityContentBlueprint.make({
  name: 'templateMonthlyStatsCard',
  params: {
    path: 'monthly-stats',
    title: 'Monthly Stats',
    loader: () =>
      import('./components/Templates/TemplateMonthlyStatsCard').then(m => (
        <m.TemplateMonthlyStatsCard />
      )),
  },
});

/**
 * Template Task Runs Card component extension.
 *
 * @alpha
 */
export const templateTaskRunsCard = EntityContentBlueprint.make({
  name: 'templateTaskRunsCard',
  params: {
    path: 'task-runs',
    title: 'Task Runs',
    loader: () =>
      import('./components/Templates/TemplateTaskRunsCard').then(m => (
        <m.TemplateTaskRunsCard />
      )),
  },
});

/**
 * Backstage frontend plugin for Usage Statistics.
 *
 * @alpha
 */
export const userSettingsPlugin = createFrontendPlugin({
  pluginId: 'usage-statistics',
  extensions: [
    usageStatisticsApi,
    templateUsageSummaryCard,
    templateMonthlyStatsCard,
    templateTaskRunsCard,
  ],
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
  }),
});

export default userSettingsPlugin;
