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
export const UsageSummaryCard = usageStatisticsPlugin.provide(
  createComponentExtension({
    name: 'UsageSummaryCard',
    component: {
      lazy: () =>
        import('./components/Templates/UsageSummaryCard').then(
          m => m.UsageSummaryCard,
        ),
    },
  }),
);
