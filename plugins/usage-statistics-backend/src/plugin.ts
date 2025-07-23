import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
/**
 * usageStatisticsPlugin backend plugin
 *
 * @public
 */
export const usageStatisticsPlugin = createBackendPlugin({
  pluginId: 'usage-statistics',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        database: coreServices.database,
        config: coreServices.rootConfig,
        lifecycle: coreServices.rootLifecycle,
      },
      async init({ logger, httpRouter, database, config, lifecycle }) {
        logger.info('Initializing usage-statistics backend plugin...');
        httpRouter.use(
          await createRouter({
            logger,
            database,
            config,
            lifecycle,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
