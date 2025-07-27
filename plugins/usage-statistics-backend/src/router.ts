import {
  DatabaseService,
  LoggerService,
  RootConfigService,
  RootLifecycleService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { DatabaseHandler } from './DatabaseHandler';

interface RouterOptions {
  logger: LoggerService;
  database: DatabaseService;
  config: RootConfigService;
  lifecycle: RootLifecycleService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, lifecycle } = options;

  const dbHandler = await DatabaseHandler.create(config, {
    logger,
    lifecycle,
  });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, res) => {
    logger.info('Success! Health check endpoint hit');
    res.status(200).send('OK');
  });

  router.get('/template/by-name/:name', async (req, res) => {
    const templateName = req.params.name;
    if (!templateName) {
      logger.error('Template name is required');
      return res.status(400).send('Template name is required');
    }

    logger.info(`Fetching data for template: ${templateName}`);

    try {
      const data = await dbHandler.getDataByTemplateName(templateName);
      return res.status(200).json(data);
    } catch (error) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      logger.error(
        `Error fetching data for template ${templateName}: ${errorMessage}`,
      );
      return res.status(500).send('Internal Server Error');
    }
  });

  router.get('/template/by-name/:name/monthly', async (req, res) => {
    const templateName = req.params.name;
    if (!templateName) {
      logger.error('Template name is required');
      res.status(400).send('Template name is required');
      return;
    }
    try {
      const data = await dbHandler.getMonthlyStatsByTemplateName(templateName);
      if (data.length === 0) {
        logger.warn(`No data found for template: ${templateName}`);
        res.status(404).send('No data found for the specified template');
        return;
      }
      logger.info(
        `Successfully fetched monthly stats for template: ${templateName}`,
      );
      logger.debug(`Monthly stats data: ${JSON.stringify(data)}`);
      res.status(200).send(JSON.stringify(data));
    } catch (error) {
      logger.error(
        `Error fetching monthly stats for template ${templateName}: ${error}`,
      );
      res.status(500).send('Internal Server Error');
    }
  });
  return router;
}
