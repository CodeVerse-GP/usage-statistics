import { Knex } from 'knex';
import {
  LoggerService,
  LifecycleService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { DatabaseManager } from '@backstage/backend-defaults/database';

type Options = {
  database: Knex;
};

export class DatabaseHandler {
  static async create(
    config: RootConfigService,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<DatabaseHandler> {
    const db = DatabaseManager.fromConfig(config).forPlugin('scaffolder', deps);
    const knex = await db.getClient();

    return new DatabaseHandler({ database: knex });
  }
  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  async getDataByTemplateName(templateName: string): Promise<any[]> {
    return this.database
      .select('id', 'status', 'created_at', 'last_heartbeat_at', 'created_by')
      .from('tasks')
      .whereRaw(
        `(spec::json -> 'templateInfo' -> 'entity' -> 'metadata' ->> 'name') = ?`,
        [templateName],
      );
  }

  async getMonthlyStatsByTemplateName(templateName: string): Promise<any[]> {
    const rows = await this.database('tasks')
      .select(
        this.database.raw(`to_char(created_at, 'YYYY-MM') as month`),
        this.database.raw(`count(*) as total`),
        this.database.raw(
          `count(*) filter (where status = 'completed') as success`,
        ),
        this.database.raw(
          `count(*) filter (where status = 'failed') as failed`,
        ),
      )
      .whereRaw(
        `(spec::jsonb -> 'templateInfo' -> 'entity' -> 'metadata' ->> 'name') = ?`,
        [templateName],
      )
      .groupByRaw(`to_char(created_at, 'YYYY-MM')`)
      .orderBy('month', 'desc');

    return rows.map(row => ({
      month: row.month,
      total: Number(row.total),
      success: Number(row.success),
      failed: Number(row.failed),
      successRate:
        Number(row.total) > 0
          ? ((Number(row.success) / Number(row.total)) * 100).toFixed(2)
          : '0.00',
    }));
  }
}
