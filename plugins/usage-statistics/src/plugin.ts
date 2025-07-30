import {
  createPlugin,
  createComponentExtension,
  discoveryApiRef,
  fetchApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { usageStatisticsApiRef, UsageStatisticsClient } from './api';
import { rootRouteRef } from './routes';

export const usageStatisticsPlugin = createPlugin({
  id: 'usage-statistics',
  apis: [
    createApiFactory({
      api: usageStatisticsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new UsageStatisticsClient({
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const TemplateUsageSummaryCard = usageStatisticsPlugin.provide(
  createComponentExtension({
    name: 'TemplateUsageSummaryCard',
    component: {
      lazy: () =>
        import('./components/Templates/TemplateUsageSummaryCard').then(
          m => m.TemplateUsageSummaryCard,
        ),
    },
  }),
);

/** @public */
export const TemplateMonthlyStatsCard = usageStatisticsPlugin.provide(
  createComponentExtension({
    name: 'TemplateMonthlyStatsCard',
    component: {
      lazy: () =>
        import('./components/Templates/TemplateMonthlyStatsCard').then(
          m => m.TemplateMonthlyStatsCard,
        ),
    },
  }),
);

/** @public */
export const TemplateTaskRunsCard = usageStatisticsPlugin.provide(
  createComponentExtension({
    name: 'TemplateTaskRunsCard',
    component: {
      lazy: () =>
        import('./components/Templates/TemplateTaskRunsCard').then(
          m => m.TemplateTaskRunsCard,
        ),
    },
  }),
);
